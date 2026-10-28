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

const REG_TTL_MS = 5 * 60_000;

export class PasskeyService {
  private store: Store; readonly cfg: PasskeyConfig;
  constructor(store: Store, cfg: PasskeyConfig) {
    this.store = store; this.cfg = cfg;
    store.db.exec(`CREATE TABLE IF NOT EXISTS passkeys (credential_id TEXT PRIMARY KEY, user_id TEXT NOT NULL, public_key TEXT NOT NULL,
        counter INTEGER NOT NULL, transports TEXT, created_at TEXT NOT NULL);
      CREATE UNIQUE INDEX IF NOT EXISTS passkeys_one_per_user ON passkeys(user_id);
      CREATE TABLE IF NOT EXISTS passkey_registrations (user_id TEXT PRIMARY KEY, challenge TEXT NOT NULL, expires_at TEXT NOT NULL);`);
  }

  credentialFor(userId: string): { credential_id: string; public_key: string; counter: number; transports: string[] } | null {
    const r = this.store.db.prepare("SELECT * FROM passkeys WHERE user_id=?").get(userId) as any;
    return r ? { credential_id: r.credential_id, public_key: r.public_key, counter: Number(r.counter), transports: JSON.parse(r.transports ?? "[]") } : null;
  }

  /** One passkey per user. Replacing it would let whoever holds the admin token re-key the user, so it is refused. */
  async registrationOptions(userId: string) {
    if (this.credentialFor(userId)) throw Object.assign(new Error("user already has a passkey"), { code: 409 });
    const opts = await generateRegistrationOptions({ rpName: this.cfg.rpName, rpID: this.cfg.rpID, userName: userId,
      userID: new Uint8Array(createHash("sha256").update(`agentguard-user:${userId}`).digest()), attestationType: "none",
      authenticatorSelection: { residentKey: "preferred", userVerification: "required" } });
    this.store.db.prepare("INSERT OR REPLACE INTO passkey_registrations VALUES (?,?,?)")
      .run(userId, opts.challenge, new Date(Date.now() + REG_TTL_MS).toISOString());
    return opts;
  }

  async verifyRegistration(userId: string, response: RegistrationResponseJSON): Promise<{ credential_id: string }> {
    const row = this.store.db.prepare("DELETE FROM passkey_registrations WHERE user_id=? RETURNING challenge, expires_at").get(userId) as any;
    if (!row || new Date() > new Date(row.expires_at)) throw Object.assign(new Error("no pending passkey registration"), { code: 409 });
    const v = await verifyRegistrationResponse({ response, expectedChallenge: row.challenge, expectedOrigin: this.cfg.origin,
      expectedRPID: this.cfg.rpID, requireUserVerification: true });
    if (!v.verified || !v.registrationInfo) throw Object.assign(new Error("passkey registration failed"), { code: 400 });
    const c = v.registrationInfo.credential;
    this.store.db.prepare("INSERT INTO passkeys VALUES (?,?,?,?,?,?)")
      .run(c.id, userId, b64u(c.publicKey), c.counter, JSON.stringify(c.transports ?? []), new Date().toISOString());
    this.store.audit("passkey.registered", userId, { credential_id: c.id, public_key: b64u(c.publicKey) });
    return { credential_id: c.id };
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
