import { createHash, randomBytes } from "node:crypto";
import {
  generateRegistrationOptions, verifyRegistrationResponse, generateAuthenticationOptions, verifyAuthenticationResponse,
  type RegistrationResponseJSON, type AuthenticationResponseJSON,
} from "@simplewebauthn/server";
import { verifySignature, isoBase64URL } from "@simplewebauthn/server/helpers";
import type { Store } from "./store.ts";
import type { UserSignature } from "./types.ts";

/**
 * User-held keys. Each user registers a WebAuthn passkey; the private key never leaves their authenticator.
 * A mandate (or its revocation) is authorized by a WebAuthn assertion whose challenge IS the message digest,
 * so the stored assertion is a portable signature anyone with the credential public key can re-verify.
 */
export interface PasskeyConfig { rpID: string; rpName: string; origin: string | string[];
  /** Time-lock before an admin-started recovery takes effect (AGENTGUARD_RECOVERY_LOCK_MS, default 72h). */
  recoveryLockMs?: number; notify?: Notifier; now?: () => Date }

export const b64u = (b: Uint8Array) => Buffer.from(b).toString("base64url");
/** Challenge for activating a mandate: the raw bytes of its canonical sha256 hash. */
export const mandateChallenge = (mandateHash: string) => b64u(Buffer.from(mandateHash, "hex"));
/** Challenge for revoking: domain-separated so a signing assertion can never be replayed as a revocation (or vice versa). */
export const revokeChallenge = (mandateHash: string) =>
  b64u(createHash("sha256").update(`agentguard:revoke:v1:${mandateHash}`).digest());

/** Challenge for passkey-authorized re-enrollment (minting a replacement enrollment token). */
export const reenrollChallenge = (userId: string, nonce: string) =>
  b64u(createHash("sha256").update(`agentguard:reenroll:v1:${userId}:${nonce}`).digest());
/** Challenge for a human decision on a held payment: sha256 over a domain tag and the canonical statement. */
export const approvalChallenge = (statementCanonical: string) =>
  b64u(createHash("sha256").update(`agentguard:approval:v1:${statementCanonical}`).digest());
export const tokenHash = (t: string) => createHash("sha256").update(`agentguard:enroll-token:v1:${t}`).digest("hex");
/** Challenge for cancelling a pending admin-started recovery with the user's CURRENT passkey. */
export const recoveryCancelChallenge = (userId: string, recoveryId: string, nonce: string) =>
  b64u(createHash("sha256").update(`agentguard:recovery-cancel:v1:${userId}:${recoveryId}:${nonce}`).digest());
export type EnrollVia = "admin_link" | "passkey" | "recovery";
export interface RecoveryInfo { recovery_id: string; started_at: string; unlock_at: string; completed_at: string; lock_ms: number; notified: boolean }
export interface Enrollment { token_id: string; via: EnrollVia; issued_by: string; issued_at: string; redeemed_at: string; replaces: string | null; recovery?: RecoveryInfo }
/** Out-of-band notice to the user (webhook, or an email relay behind one). Must not throw. */
export type Notifier = (event: string, data: Record<string, unknown>) => Promise<boolean>;
export function webhookNotifier(url: string | undefined, http: typeof fetch = fetch): Notifier {
  return async (event, data) => {
    if (!url) { console.warn(`[notify] ${event} for ${data.user_id}: AGENTGUARD_NOTIFY_WEBHOOK not set`); return false; }
    try { const r = await http(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ event, ...data }), signal: AbortSignal.timeout(10_000) }); return r.ok; }
    catch { return false; }
  };
}
export const DEFAULT_RECOVERY_LOCK_MS = 72 * 3600_000;

const REG_TTL_MS = 5 * 60_000;
const ENROLL_TTL_MS = 15 * 60_000;

export class PasskeyService {
  private store: Store; readonly cfg: PasskeyConfig;
  constructor(store: Store, cfg: PasskeyConfig) {
    this.store = store; this.cfg = cfg;
    store.db.ddl(`CREATE TABLE IF NOT EXISTS passkeys (credential_id TEXT PRIMARY KEY, user_id TEXT NOT NULL, public_key TEXT NOT NULL,
        counter INTEGER NOT NULL, transports TEXT, created_at TEXT NOT NULL);
      CREATE UNIQUE INDEX IF NOT EXISTS passkeys_one_per_user ON passkeys(user_id);
      CREATE TABLE IF NOT EXISTS passkey_registrations (user_id TEXT PRIMARY KEY, challenge TEXT NOT NULL, expires_at TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS enrollment_tokens (token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL, via TEXT NOT NULL, issued_by TEXT NOT NULL,
        issued_at TEXT NOT NULL, expires_at TEXT NOT NULL, replaces TEXT, used_at TEXT);
      CREATE TABLE IF NOT EXISTS passkey_reenroll (user_id TEXT PRIMARY KEY, nonce TEXT NOT NULL, expires_at TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS passkey_recoveries (recovery_id TEXT PRIMARY KEY, user_id TEXT NOT NULL, credential_id TEXT NOT NULL,
        public_key TEXT NOT NULL, counter INTEGER NOT NULL, transports TEXT, enrollment TEXT NOT NULL, replaces TEXT NOT NULL,
        started_at TEXT NOT NULL, unlock_at TEXT NOT NULL, status TEXT NOT NULL, notified INTEGER NOT NULL DEFAULT 0,
        cancel_nonce TEXT, cancel_nonce_expires_at TEXT, resolved_at TEXT);`);
    const cols = (t: string) => store.db.columns(t);
    if (cols("passkeys") && !cols("passkeys")!.includes("enrollment")) store.db.ddl("ALTER TABLE passkeys ADD COLUMN enrollment TEXT");
    if (cols("passkey_registrations") && !cols("passkey_registrations")!.includes("token_hash")) store.db.ddl("ALTER TABLE passkey_registrations ADD COLUMN token_hash TEXT");
  }

  private now(): Date { return this.cfg.now?.() ?? new Date(); }
  get lockMs(): number { return this.cfg.recoveryLockMs ?? DEFAULT_RECOVERY_LOCK_MS; }

  async credentialFor(userId: string): Promise<{ credential_id: string; public_key: string; counter: number; transports: string[] } | null> {
    await this.finalizeRecoveries(userId);
    const r = await this.store.db.prepare("SELECT * FROM passkeys WHERE user_id=?").get(userId) as any;
    return r ? { credential_id: r.credential_id, public_key: r.public_key, counter: Number(r.counter), transports: JSON.parse(r.transports ?? "[]") } : null;
  }

  async enrollmentFor(userId: string): Promise<Enrollment | null> {
    const r = await this.store.db.prepare("SELECT enrollment FROM passkeys WHERE user_id=?").get(userId) as any;
    return r?.enrollment ? JSON.parse(r.enrollment) : null;
  }

  /**
   * Issue a single-use, short-lived enrollment token bound to one user. Only redeeming one can register a passkey
   * (no trust-on-first-use). Stored as sha256 only. If the user already has a passkey, the token is a replacement
   * and redeeming it swaps the key; that is logged and later shown on receipts.
   */
  async issueEnrollment(userId: string, o: { issuedBy?: string; via?: "admin_link" | "passkey"; ttlMs?: number } = {}): Promise<{ token: string; token_id: string; user_id: string; expires_at: string; replaces: string | null; via: EnrollVia }> {
    if (!userId) throw Object.assign(new Error("user_id is required"), { code: 400 });
    const ttl = Math.min(Math.max(o.ttlMs ?? ENROLL_TTL_MS, 60_000), 24 * 3600_000);
    const token = "agenr_" + randomBytes(32).toString("base64url");
    const hash = tokenHash(token), tokenId = hash.slice(0, 16);
    const replaces = (await this.credentialFor(userId))?.credential_id ?? null;
    const issued_at = this.now().toISOString(), expires_at = new Date(this.now().getTime() + ttl).toISOString();
    // The admin alone can never swap an existing passkey: an admin link for a user who has one starts a time-locked recovery.
    const via: EnrollVia = o.via === "passkey" ? "passkey" : replaces ? "recovery" : "admin_link", issued_by = String(o.issuedBy ?? "admin").slice(0, 100);
    await this.store.db.prepare("INSERT INTO enrollment_tokens (token_hash,user_id,via,issued_by,issued_at,expires_at,replaces) VALUES (?,?,?,?,?,?,?)")
      .run(hash, userId, via, issued_by, issued_at, expires_at, replaces);
    await this.store.audit("enrollment.issued", userId, { token_id: tokenId, via, issued_by, expires_at, replaces });
    return { token, token_id: tokenId, user_id: userId, expires_at, replaces, via };
  }

  private async liveToken(token: string): Promise<any> {
    const row = typeof token === "string" && token ? await this.store.db.prepare("SELECT * FROM enrollment_tokens WHERE token_hash=?").get(tokenHash(token)) as any : null;
    if (!row) throw Object.assign(new Error("invalid enrollment token"), { code: 403 });
    if (row.used_at) throw Object.assign(new Error("enrollment token already used"), { code: 410 });
    if (this.now() > new Date(row.expires_at)) throw Object.assign(new Error("enrollment token expired"), { code: 410 });
    return row;
  }

  /** WebAuthn creation options for the user the token is bound to. The token is not consumed until verification. */
  async registrationOptions(token: string) {
    const row = await this.liveToken(token);
    const userId = row.user_id as string;
    const opts = await generateRegistrationOptions({ rpName: this.cfg.rpName, rpID: this.cfg.rpID, userName: userId,
      userID: new Uint8Array(createHash("sha256").update(`agentguard-user:${userId}`).digest()), attestationType: "none",
      authenticatorSelection: { residentKey: "preferred", userVerification: "required" } });
    await this.store.db.prepare("INSERT INTO passkey_registrations (user_id,challenge,expires_at,token_hash) VALUES (?,?,?,?) ON CONFLICT(user_id) DO UPDATE SET challenge=excluded.challenge, expires_at=excluded.expires_at, token_hash=excluded.token_hash")
      .run(userId, opts.challenge, new Date(Date.now() + REG_TTL_MS).toISOString(), row.token_hash);
    return { ...opts, user_id: userId, replaces: row.replaces ?? null };
  }

  async verifyRegistration(token: string, response: RegistrationResponseJSON): Promise<{ credential_id: string; user_id: string; enrollment: Enrollment;
    pending_recovery?: { recovery_id: string; started_at: string; unlock_at: string } }> {
    const tok = await this.liveToken(token);
    const userId = tok.user_id as string;
    const reg = await this.store.db.prepare("DELETE FROM passkey_registrations WHERE user_id=? AND token_hash=? RETURNING challenge, expires_at").get(userId, tok.token_hash) as any;
    if (!reg || this.now() > new Date(reg.expires_at)) throw Object.assign(new Error("no pending passkey registration"), { code: 409 });
    const v = await verifyRegistrationResponse({ response, expectedChallenge: reg.challenge, expectedOrigin: this.cfg.origin,
      expectedRPID: this.cfg.rpID, requireUserVerification: true });
    if (!v.verified || !v.registrationInfo) throw Object.assign(new Error("passkey registration failed"), { code: 400 });
    const c = v.registrationInfo.credential;
    let recovery = null as { recovery_id: string; started_at: string; unlock_at: string } | null;
    const enrollment: Enrollment = { token_id: String(tok.token_hash).slice(0, 16), via: tok.via, issued_by: tok.issued_by, issued_at: tok.issued_at,
      redeemed_at: this.now().toISOString(), replaces: null };
    await this.store.tx(async () => {
      // Atomic single use: only one redemption can flip used_at.
      const used = await this.store.db.prepare("UPDATE enrollment_tokens SET used_at=? WHERE token_hash=? AND used_at IS NULL AND expires_at > ?")
        .run(enrollment.redeemed_at, tok.token_hash, enrollment.redeemed_at);
      if (Number(used.changes) !== 1) throw Object.assign(new Error("enrollment token already used"), { code: 410 });
      const cur = await this.credentialFor(userId);
      if (cur && cur.credential_id !== tok.replaces) throw Object.assign(new Error("passkey changed since this enrollment token was issued"), { code: 409 });
      if (tok.via === "recovery" || (cur && tok.via !== "passkey")) {
        // Recovery: park the new key. It cannot sign anything until the lock expires; the current passkey can cancel.
        if (!cur) throw Object.assign(new Error("nothing to recover: user has no passkey; issue a fresh enrollment"), { code: 409 });
        enrollment.via = "recovery"; enrollment.replaces = cur.credential_id;
        const start = this.now(), unlock = new Date(start.getTime() + this.lockMs);
        recovery = { recovery_id: "rcv_" + randomBytes(12).toString("hex"), started_at: start.toISOString(), unlock_at: unlock.toISOString() };
        await this.store.db.prepare("UPDATE passkey_recoveries SET status='superseded', resolved_at=? WHERE user_id=? AND status='pending'").run(start.toISOString(), userId);
        await this.store.db.prepare(`INSERT INTO passkey_recoveries (recovery_id,user_id,credential_id,public_key,counter,transports,enrollment,replaces,started_at,unlock_at,status)
          VALUES (?,?,?,?,?,?,?,?,?,?,'pending')`).run(recovery.recovery_id, userId, c.id, b64u(c.publicKey), c.counter, JSON.stringify(c.transports ?? []),
            JSON.stringify(enrollment), cur.credential_id, recovery.started_at, recovery.unlock_at);
        await this.store.audit("passkey.recovery_started", userId, { ...recovery, lock_ms: this.lockMs, new_credential_id: c.id, public_key: b64u(c.publicKey), replaces: cur.credential_id, enrollment });
        return;
      }
      if (cur) { enrollment.replaces = cur.credential_id; await this.store.db.prepare("DELETE FROM passkeys WHERE user_id=?").run(userId); await this.freezeMandates(userId, cur.credential_id, "passkey"); }
      await this.store.db.prepare("INSERT INTO passkeys (credential_id,user_id,public_key,counter,transports,created_at,enrollment) VALUES (?,?,?,?,?,?,?)")
        .run(c.id, userId, b64u(c.publicKey), c.counter, JSON.stringify(c.transports ?? []), enrollment.redeemed_at, JSON.stringify(enrollment));
      await this.store.audit(cur ? "passkey.replaced" : "passkey.registered", userId, { credential_id: c.id, public_key: b64u(c.publicKey), enrollment });
    });
    if (recovery) {
      const notified = await (this.cfg.notify ?? webhookNotifier(undefined))("passkey.recovery_started", { user_id: userId, ...recovery,
        cancel: `POST /v1/users/${userId}/recovery/cancel-request then /recovery/cancel with your current passkey` });
      await this.store.db.prepare("UPDATE passkey_recoveries SET notified=? WHERE recovery_id=?").run(notified ? 1 : 0, recovery.recovery_id);
      await this.store.audit(notified ? "user.notified" : "user.notify_failed", userId, { event: "passkey.recovery_started", recovery_id: recovery.recovery_id });
      return { credential_id: c.id, user_id: userId, enrollment, pending_recovery: recovery };
    }
    return { credential_id: c.id, user_id: userId, enrollment };
  }

  /** Mandates signed by a replaced key are frozen (never enforced) until the user re-signs them with the new key. */
  private async freezeMandates(userId: string, oldCredentialId: string, via: string) {
    const rows = await this.store.db.prepare("SELECT mandate_id, user_signature FROM mandates WHERE user_id=? AND status='active'").all(userId) as any[];
    for (const r of rows) {
      if (JSON.parse(r.user_signature ?? "null")?.credential_id !== oldCredentialId) continue;
      await this.store.db.prepare("UPDATE mandates SET status='frozen', updated_at=? WHERE mandate_id=? AND status='active'").run(this.now().toISOString(), r.mandate_id);
      await this.store.audit("mandate.frozen", r.mandate_id, { reason: `signing passkey replaced via ${via}; re-sign with the new passkey`, old_credential_id: oldCredentialId });
    }
  }

  /** Pending recovery (if any), public view. */
  async recoveryFor(userId: string) {
    await this.finalizeRecoveries(userId);
    const r = await this.store.db.prepare("SELECT recovery_id,credential_id,replaces,started_at,unlock_at,status,notified,resolved_at FROM passkey_recoveries WHERE user_id=? ORDER BY started_at DESC LIMIT 1").get(userId) as any;
    return r ? { ...r, notified: !!r.notified } : null;
  }

  /** Lazily completes recoveries whose lock has expired (and that the current passkey did not cancel). */
  async finalizeRecoveries(userId?: string): Promise<number> {
    const nowIso = this.now().toISOString();
    const due = await this.store.db.prepare(`SELECT * FROM passkey_recoveries WHERE status='pending' AND unlock_at <= ? ${userId ? "AND user_id=?" : ""}`)
      .all(...(userId ? [nowIso, userId] : [nowIso])) as any[];
    let n = 0;
    for (const r of due) {
      await this.store.tx(async () => {
        const cur = await this.store.db.prepare("SELECT credential_id FROM passkeys WHERE user_id=?").get(r.user_id) as any;
        if (cur?.credential_id !== r.replaces) {
          await this.store.db.prepare("UPDATE passkey_recoveries SET status='superseded', resolved_at=? WHERE recovery_id=? AND status='pending'").run(nowIso, r.recovery_id);
          await this.store.audit("passkey.recovery_superseded", r.user_id, { recovery_id: r.recovery_id, reason: "passkey changed during the lock" });
          return;
        }
        const enrollment: Enrollment = { ...JSON.parse(r.enrollment), via: "recovery", replaces: r.replaces,
          recovery: { recovery_id: r.recovery_id, started_at: r.started_at, unlock_at: r.unlock_at, completed_at: nowIso,
            lock_ms: new Date(r.unlock_at).getTime() - new Date(r.started_at).getTime(), notified: !!r.notified } };
        await this.store.db.prepare("DELETE FROM passkeys WHERE user_id=?").run(r.user_id);
        await this.store.db.prepare("INSERT INTO passkeys (credential_id,user_id,public_key,counter,transports,created_at,enrollment) VALUES (?,?,?,?,?,?,?)")
          .run(r.credential_id, r.user_id, r.public_key, r.counter, r.transports, nowIso, JSON.stringify(enrollment));
        await this.store.db.prepare("UPDATE passkey_recoveries SET status='completed', resolved_at=? WHERE recovery_id=?").run(nowIso, r.recovery_id);
        await this.store.audit("passkey.replaced", r.user_id, { credential_id: r.credential_id, public_key: r.public_key, enrollment });
        await this.freezeMandates(r.user_id, r.replaces, "recovery");
        n++;
      });
    }
    return n;
  }

  /** Re-send the out-of-band notice for pending recoveries whose first notification failed (cron maintenance). */
  async retryNotifications(): Promise<number> {
    const rows = await this.store.db.prepare("SELECT recovery_id,user_id,started_at,unlock_at FROM passkey_recoveries WHERE status='pending' AND notified=0").all();
    let n = 0;
    for (const r of rows) {
      const ok = await (this.cfg.notify ?? webhookNotifier(undefined))("passkey.recovery_started", { user_id: r.user_id, recovery_id: r.recovery_id,
        started_at: r.started_at, unlock_at: r.unlock_at, retry: true,
        cancel: `POST /v1/users/${r.user_id}/recovery/cancel-request then /recovery/cancel with your current passkey` });
      if (!ok) continue;
      await this.store.db.prepare("UPDATE passkey_recoveries SET notified=1 WHERE recovery_id=? AND notified=0").run(r.recovery_id);
      await this.store.audit("user.notified", r.user_id, { event: "passkey.recovery_started", recovery_id: r.recovery_id, retry: true });
      n++;
    }
    return n;
  }

  /** Cancel step 1: the CURRENT passkey must sign a fresh nonce bound to this recovery. */
  async recoveryCancelRequest(userId: string) {
    const rec = await this.recoveryFor(userId);
    if (!rec || rec.status !== "pending") throw Object.assign(new Error("no pending recovery"), { code: 409 });
    const nonce = randomBytes(16).toString("hex"), exp = new Date(this.now().getTime() + REG_TTL_MS).toISOString();
    const options = await this.signingOptions(userId, recoveryCancelChallenge(userId, rec.recovery_id, nonce));
    await this.store.db.prepare("UPDATE passkey_recoveries SET cancel_nonce=?, cancel_nonce_expires_at=? WHERE recovery_id=?").run(nonce, exp, rec.recovery_id);
    return { user_id: userId, recovery_id: rec.recovery_id, statement: `agentguard:recovery-cancel:v1:${userId}:${rec.recovery_id}:${nonce}`, expires_at: exp, options };
  }
  /** Cancel step 2. Only the key being replaced can stop its replacement; the admin token cannot. */
  async cancelRecovery(userId: string, assertion: AuthenticationResponseJSON) {
    const rec = await this.store.db.prepare("SELECT * FROM passkey_recoveries WHERE user_id=? AND status='pending' ORDER BY started_at DESC LIMIT 1").get(userId) as any;
    if (!rec || !rec.cancel_nonce || this.now() > new Date(rec.cancel_nonce_expires_at)) throw Object.assign(new Error("no pending recovery cancel request"), { code: 409 });
    const sig = await this.verifyAssertion(userId, assertion, recoveryCancelChallenge(userId, rec.recovery_id, rec.cancel_nonce));
    const nowIso = this.now().toISOString();
    const u = await this.store.db.prepare("UPDATE passkey_recoveries SET status='cancelled', resolved_at=?, cancel_nonce=NULL WHERE recovery_id=? AND status='pending' AND cancel_nonce=?").run(nowIso, rec.recovery_id, rec.cancel_nonce);
    if (Number(u.changes) !== 1) throw Object.assign(new Error("recovery already resolved"), { code: 409 });
    await this.store.audit("passkey.recovery_cancelled", userId, { recovery_id: rec.recovery_id, user_signature: sig });
    return { recovery_id: rec.recovery_id, status: "cancelled" };
  }

  /** Re-enrollment authorized by the user's existing passkey (no admin involvement). Step 1: a fresh nonce to sign. */
  async reenrollRequest(userId: string) {
    const nonce = randomBytes(16).toString("hex"), expires_at = new Date(this.now().getTime() + REG_TTL_MS).toISOString();
    const options = await this.signingOptions(userId, reenrollChallenge(userId, nonce));
    await this.store.db.prepare("INSERT INTO passkey_reenroll (user_id,nonce,expires_at) VALUES (?,?,?) ON CONFLICT(user_id) DO UPDATE SET nonce=excluded.nonce, expires_at=excluded.expires_at").run(userId, nonce, expires_at);
    return { user_id: userId, statement: `agentguard:reenroll:v1:${userId}:${nonce}`, expires_at, options };
  }
  /** Step 2: the existing passkey's assertion over that nonce mints a replacement enrollment token. */
  async reenroll(userId: string, assertion: AuthenticationResponseJSON) {
    const row = await this.store.db.prepare("DELETE FROM passkey_reenroll WHERE user_id=? RETURNING nonce, expires_at").get(userId) as any;
    if (!row || this.now() > new Date(row.expires_at)) throw Object.assign(new Error("no pending re-enrollment request"), { code: 409 });
    const sig = await this.verifyAssertion(userId, assertion, reenrollChallenge(userId, row.nonce));
    const t = await this.issueEnrollment(userId, { via: "passkey", issuedBy: `passkey:${sig.credential_id}` });
    await this.store.audit("enrollment.passkey_authorized", userId, { token_id: t.token_id, nonce: row.nonce, user_signature: sig });
    return t;
  }

  /** Options for navigator.credentials.get with the message digest as the challenge. */
  async signingOptions(userId: string, challenge: string) {
    const cred = await this.credentialFor(userId);
    if (!cred) throw Object.assign(new Error("user has no passkey; register one first"), { code: 409 });
    return generateAuthenticationOptions({ rpID: this.cfg.rpID, challenge: isoBase64URL.toBuffer(challenge),
      allowCredentials: [{ id: cred.credential_id, transports: cred.transports as any }], userVerification: "required" });
  }

  /** Full WebAuthn verification at signing time (origin, RP, UV, counter). Returns the portable signature to store. */
  async verifyAssertion(userId: string, response: AuthenticationResponseJSON, challenge: string): Promise<UserSignature> {
    const cred = await this.credentialFor(userId);
    if (!cred) throw Object.assign(new Error("user has no passkey"), { code: 409 });
    if (response?.id !== cred.credential_id) throw Object.assign(new Error("assertion is not from this user's passkey"), { code: 403 });
    let v;
    try {
      v = await verifyAuthenticationResponse({ response, expectedChallenge: challenge, expectedOrigin: this.cfg.origin, expectedRPID: this.cfg.rpID,
        credential: { id: cred.credential_id, publicKey: isoBase64URL.toBuffer(cred.public_key), counter: cred.counter, transports: cred.transports as any },
        requireUserVerification: true });
    } catch (e) { throw Object.assign(new Error(`passkey signature rejected: ${(e as Error).message}`), { code: 403 }); }
    if (!v.verified) throw Object.assign(new Error("passkey signature rejected"), { code: 403 });
    await this.store.db.prepare("UPDATE passkeys SET counter=? WHERE credential_id=?").run(v.authenticationInfo.newCounter, cred.credential_id);
    return { credential_id: cred.credential_id, authenticator_data: response.response.authenticatorData,
      client_data_json: response.response.clientDataJSON, signature: response.response.signature };
  }

  /**
   * Stateless re-verification of a stored signature (run on every proposal). Checks the signature over
   * authenticatorData || sha256(clientDataJSON) with the user's registered public key, and that the signed
   * challenge is exactly `challenge`, type webauthn.get, our origin and RP, with user presence + verification.
   * No counter check: the counter only defends against cloned authenticators at signing time.
   */
  async reverify(userId: string, sig: UserSignature | null | undefined, challenge: string): Promise<boolean> {
    try {
      if (!sig) return false;
      const cred = await this.credentialFor(userId);
      if (!cred || cred.credential_id !== sig.credential_id) return false;
      const cdjBytes = Buffer.from(sig.client_data_json, "base64url");
      const cd = JSON.parse(cdjBytes.toString("utf8"));
      const origins = Array.isArray(this.cfg.origin) ? this.cfg.origin : [this.cfg.origin];
      if (cd.type !== "webauthn.get" || cd.challenge !== challenge || !origins.includes(cd.origin)) return false;
      const ad = Buffer.from(sig.authenticator_data, "base64url");
      if (ad.length < 37) return false;
      if (!ad.subarray(0, 32).equals(createHash("sha256").update(this.cfg.rpID).digest())) return false;
      const flags = ad[32];
      if (!(flags & 0x01) || !(flags & 0x04)) return false;   // UP and UV
      const data = Buffer.concat([ad, createHash("sha256").update(cdjBytes).digest()]);
      return await verifySignature({ signature: new Uint8Array(Buffer.from(sig.signature, "base64url")), data: new Uint8Array(data),
        credentialPublicKey: new Uint8Array(Buffer.from(cred.public_key, "base64url")) });
    } catch { return false; }
  }
}

export const randomId = () => randomBytes(16).toString("hex");
