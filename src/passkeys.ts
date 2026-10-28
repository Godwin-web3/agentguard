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
export interface PasskeyConfig { rpID: string; rpName: string; origin: string | string[] }

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
export interface Enrollment { token_id: string; via: "admin_link" | "passkey"; issued_by: string; issued_at: string; redeemed_at: string; replaces: string | null }

const REG_TTL_MS = 5 * 60_000;
const ENROLL_TTL_MS = 15 * 60_000;

export class PasskeyService {
  private store: Store; readonly cfg: PasskeyConfig;
  constructor(store: Store, cfg: PasskeyConfig) {
    this.store = store; this.cfg = cfg;
    store.db.exec(`CREATE TABLE IF NOT EXISTS passkeys (credential_id TEXT PRIMARY KEY, user_id TEXT NOT NULL, public_key TEXT NOT NULL,
        counter INTEGER NOT NULL, transports TEXT, created_at TEXT NOT NULL);
      CREATE UNIQUE INDEX IF NOT EXISTS passkeys_one_per_user ON passkeys(user_id);
      CREATE TABLE IF NOT EXISTS passkey_registrations (user_id TEXT PRIMARY KEY, challenge TEXT NOT NULL, expires_at TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS enrollment_tokens (token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL, via TEXT NOT NULL, issued_by TEXT NOT NULL,
        issued_at TEXT NOT NULL, expires_at TEXT NOT NULL, replaces TEXT, used_at TEXT);
      CREATE TABLE IF NOT EXISTS passkey_reenroll (user_id TEXT PRIMARY KEY, nonce TEXT NOT NULL, expires_at TEXT NOT NULL);`);
    const cols = (t: string) => (store.db.prepare(`PRAGMA table_info(${t})`).all() as any[]).map(c => c.name);
    if (!cols("passkeys").includes("enrollment")) store.db.exec("ALTER TABLE passkeys ADD COLUMN enrollment TEXT");
    if (!cols("passkey_registrations").includes("token_hash")) store.db.exec("ALTER TABLE passkey_registrations ADD COLUMN token_hash TEXT");
  }

  credentialFor(userId: string): { credential_id: string; public_key: string; counter: number; transports: string[] } | null {
    const r = this.store.db.prepare("SELECT * FROM passkeys WHERE user_id=?").get(userId) as any;
    return r ? { credential_id: r.credential_id, public_key: r.public_key, counter: Number(r.counter), transports: JSON.parse(r.transports ?? "[]") } : null;
  }

  enrollmentFor(userId: string): Enrollment | null {
    const r = this.store.db.prepare("SELECT enrollment FROM passkeys WHERE user_id=?").get(userId) as any;
    return r?.enrollment ? JSON.parse(r.enrollment) : null;
  }

  /**
   * Issue a single-use, short-lived enrollment token bound to one user. Only redeeming one can register a passkey
   * (no trust-on-first-use). Stored as sha256 only. If the user already has a passkey, the token is a replacement
   * and redeeming it swaps the key; that is logged and later shown on receipts.
   */
  issueEnrollment(userId: string, o: { issuedBy?: string; via?: "admin_link" | "passkey"; ttlMs?: number } = {}): { token: string; token_id: string; user_id: string; expires_at: string; replaces: string | null } {
    if (!userId) throw Object.assign(new Error("user_id is required"), { code: 400 });
    const ttl = Math.min(Math.max(o.ttlMs ?? ENROLL_TTL_MS, 60_000), 24 * 3600_000);
    const token = "agenr_" + randomBytes(32).toString("base64url");
    const hash = tokenHash(token), tokenId = hash.slice(0, 16);
    const replaces = this.credentialFor(userId)?.credential_id ?? null;
    const issued_at = new Date().toISOString(), expires_at = new Date(Date.now() + ttl).toISOString();
    const via = o.via ?? "admin_link", issued_by = String(o.issuedBy ?? "admin").slice(0, 100);
    this.store.db.prepare("INSERT INTO enrollment_tokens (token_hash,user_id,via,issued_by,issued_at,expires_at,replaces) VALUES (?,?,?,?,?,?,?)")
      .run(hash, userId, via, issued_by, issued_at, expires_at, replaces);
    this.store.audit("enrollment.issued", userId, { token_id: tokenId, via, issued_by, expires_at, replaces });
    return { token, token_id: tokenId, user_id: userId, expires_at, replaces };
  }

  private liveToken(token: string): any {
    const row = typeof token === "string" && token ? this.store.db.prepare("SELECT * FROM enrollment_tokens WHERE token_hash=?").get(tokenHash(token)) as any : null;
    if (!row) throw Object.assign(new Error("invalid enrollment token"), { code: 403 });
    if (row.used_at) throw Object.assign(new Error("enrollment token already used"), { code: 410 });
    if (new Date() > new Date(row.expires_at)) throw Object.assign(new Error("enrollment token expired"), { code: 410 });
    return row;
  }

  /** WebAuthn creation options for the user the token is bound to. The token is not consumed until verification. */
  async registrationOptions(token: string) {
    const row = this.liveToken(token);
    const userId = row.user_id as string;
    const opts = await generateRegistrationOptions({ rpName: this.cfg.rpName, rpID: this.cfg.rpID, userName: userId,
      userID: new Uint8Array(createHash("sha256").update(`agentguard-user:${userId}`).digest()), attestationType: "none",
      authenticatorSelection: { residentKey: "preferred", userVerification: "required" } });
    this.store.db.prepare("INSERT OR REPLACE INTO passkey_registrations (user_id,challenge,expires_at,token_hash) VALUES (?,?,?,?)")
      .run(userId, opts.challenge, new Date(Date.now() + REG_TTL_MS).toISOString(), row.token_hash);
    return { ...opts, user_id: userId, replaces: row.replaces ?? null };
  }

  async verifyRegistration(token: string, response: RegistrationResponseJSON): Promise<{ credential_id: string; user_id: string; enrollment: Enrollment }> {
    const tok = this.liveToken(token);
    const userId = tok.user_id as string;
    const reg = this.store.db.prepare("DELETE FROM passkey_registrations WHERE user_id=? AND token_hash=? RETURNING challenge, expires_at").get(userId, tok.token_hash) as any;
    if (!reg || new Date() > new Date(reg.expires_at)) throw Object.assign(new Error("no pending passkey registration"), { code: 409 });
    const v = await verifyRegistrationResponse({ response, expectedChallenge: reg.challenge, expectedOrigin: this.cfg.origin,
      expectedRPID: this.cfg.rpID, requireUserVerification: true });
    if (!v.verified || !v.registrationInfo) throw Object.assign(new Error("passkey registration failed"), { code: 400 });
    const c = v.registrationInfo.credential;
    const enrollment: Enrollment = { token_id: String(tok.token_hash).slice(0, 16), via: tok.via, issued_by: tok.issued_by, issued_at: tok.issued_at,
      redeemed_at: new Date().toISOString(), replaces: null };
    this.store.tx(() => {
      // Atomic single use: only one redemption can flip used_at.
      const used = this.store.db.prepare("UPDATE enrollment_tokens SET used_at=? WHERE token_hash=? AND used_at IS NULL AND expires_at > ?")
        .run(enrollment.redeemed_at, tok.token_hash, enrollment.redeemed_at);
      if (Number(used.changes) !== 1) throw Object.assign(new Error("enrollment token already used"), { code: 410 });
      const cur = this.credentialFor(userId);
      if (cur && cur.credential_id !== tok.replaces) throw Object.assign(new Error("passkey changed since this enrollment token was issued"), { code: 409 });
      if (cur) { enrollment.replaces = cur.credential_id; this.store.db.prepare("DELETE FROM passkeys WHERE user_id=?").run(userId); }
      this.store.db.prepare("INSERT INTO passkeys (credential_id,user_id,public_key,counter,transports,created_at,enrollment) VALUES (?,?,?,?,?,?,?)")
        .run(c.id, userId, b64u(c.publicKey), c.counter, JSON.stringify(c.transports ?? []), enrollment.redeemed_at, JSON.stringify(enrollment));
      this.store.audit(cur ? "passkey.replaced" : "passkey.registered", userId, { credential_id: c.id, public_key: b64u(c.publicKey), enrollment });
    });
    return { credential_id: c.id, user_id: userId, enrollment };
  }

  /** Re-enrollment authorized by the user's existing passkey (no admin involvement). Step 1: a fresh nonce to sign. */
  async reenrollRequest(userId: string) {
    const nonce = randomBytes(16).toString("hex"), expires_at = new Date(Date.now() + REG_TTL_MS).toISOString();
    const options = await this.signingOptions(userId, reenrollChallenge(userId, nonce));
    this.store.db.prepare("INSERT OR REPLACE INTO passkey_reenroll (user_id,nonce,expires_at) VALUES (?,?,?)").run(userId, nonce, expires_at);
    return { user_id: userId, statement: `agentguard:reenroll:v1:${userId}:${nonce}`, expires_at, options };
  }
  /** Step 2: the existing passkey's assertion over that nonce mints a replacement enrollment token. */
  async reenroll(userId: string, assertion: AuthenticationResponseJSON) {
    const row = this.store.db.prepare("DELETE FROM passkey_reenroll WHERE user_id=? RETURNING nonce, expires_at").get(userId) as any;
    if (!row || new Date() > new Date(row.expires_at)) throw Object.assign(new Error("no pending re-enrollment request"), { code: 409 });
    const sig = await this.verifyAssertion(userId, assertion, reenrollChallenge(userId, row.nonce));
    const t = this.issueEnrollment(userId, { via: "passkey", issuedBy: `passkey:${sig.credential_id}` });
    this.store.audit("enrollment.passkey_authorized", userId, { token_id: t.token_id, nonce: row.nonce, user_signature: sig });
    return t;
  }

  /** Options for navigator.credentials.get with the message digest as the challenge. */
  async signingOptions(userId: string, challenge: string) {
    const cred = this.credentialFor(userId);
    if (!cred) throw Object.assign(new Error("user has no passkey; register one first"), { code: 409 });
    return generateAuthenticationOptions({ rpID: this.cfg.rpID, challenge: isoBase64URL.toBuffer(challenge),
      allowCredentials: [{ id: cred.credential_id, transports: cred.transports as any }], userVerification: "required" });
  }

  /** Full WebAuthn verification at signing time (origin, RP, UV, counter). Returns the portable signature to store. */
  async verifyAssertion(userId: string, response: AuthenticationResponseJSON, challenge: string): Promise<UserSignature> {
    const cred = this.credentialFor(userId);
    if (!cred) throw Object.assign(new Error("user has no passkey"), { code: 409 });
    if (response?.id !== cred.credential_id) throw Object.assign(new Error("assertion is not from this user's passkey"), { code: 403 });
    let v;
    try {
      v = await verifyAuthenticationResponse({ response, expectedChallenge: challenge, expectedOrigin: this.cfg.origin, expectedRPID: this.cfg.rpID,
        credential: { id: cred.credential_id, publicKey: isoBase64URL.toBuffer(cred.public_key), counter: cred.counter, transports: cred.transports as any },
        requireUserVerification: true });
    } catch (e) { throw Object.assign(new Error(`passkey signature rejected: ${(e as Error).message}`), { code: 403 }); }
    if (!v.verified) throw Object.assign(new Error("passkey signature rejected"), { code: 403 });
    this.store.db.prepare("UPDATE passkeys SET counter=? WHERE credential_id=?").run(v.authenticationInfo.newCounter, cred.credential_id);
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
      const cred = this.credentialFor(userId);
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
