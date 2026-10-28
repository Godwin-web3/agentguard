import { generateKeyPairSync, createPrivateKey, createPublicKey, createHash, sign, verify, type KeyObject } from "node:crypto";
import { existsSync, readFileSync, writeFileSync, mkdirSync, renameSync } from "node:fs";
import { dirname } from "node:path";

/** Ed25519 signing key for mandates and approvals. Loaded from AGENTGUARD_SIGNING_KEY (PEM) or a key file. */
export class Signer {
  private priv: KeyObject;
  readonly pub: KeyObject;
  constructor(priv: KeyObject) { this.priv = priv; this.pub = createPublicKey(priv); }

  static load(path = process.env.AGENTGUARD_KEY_FILE ?? "./data/signing-key.pem"): Signer {
    const pem = process.env.AGENTGUARD_SIGNING_KEY;
    if (pem) return new Signer(createPrivateKey(pem));
    if (existsSync(path)) return new Signer(createPrivateKey(readFileSync(path)));
    const { privateKey } = generateKeyPairSync("ed25519");
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, privateKey.export({ type: "pkcs8", format: "pem" }), { mode: 0o600 });
    return new Signer(privateKey);
  }
  static ephemeral(): Signer { return new Signer(generateKeyPairSync("ed25519").privateKey); }

  sign(message: string): string { return sign(null, Buffer.from(message), this.priv).toString("base64"); }
  verify(message: string, sig: string): boolean {
    try { return verify(null, Buffer.from(message), this.pub, Buffer.from(sig, "base64")); } catch { return false; }
  }
  publicKeyPem(): string { return this.pub.export({ type: "spki", format: "pem" }).toString(); }
}

/** Anything that signs as the issuer (a single Signer or the active key of a KeyRing). */
export interface IssuerSigner { sign(message: string): string; publicKeyPem(): string }

export interface IssuerKeyRecord { kid: string; created: string | null; retired: string | null; private_pem: string }
/** Public view of one issuer key, JWKS-style (RFC 8037 OKP/Ed25519) plus lifecycle dates. */
export interface IssuerJwk { kty: "OKP"; crv: "Ed25519"; x: string; kid: string; alg: "EdDSA"; use: "sig";
  status: "active" | "retired"; created: string | null; retired: string | null; public_key_pem: string }

/** kid: first 16 bytes of sha256(SPKI DER), hex (same as the receipt key_id). */
export function kidOf(pubPem: string): string {
  const der = Buffer.from(pubPem.replace(/-----[^-]+-----/g, "").replace(/\s+/g, ""), "base64");
  return createHash("sha256").update(der).digest("hex").slice(0, 32);
}

/**
 * Issuer key ring with rotation. Exactly one key is active for signing; retired keys stay published so receipts
 * they signed keep verifying, but a verifier rejects anything a retired key signed after its retirement.
 * Persisted at AGENTGUARD_KEYRING_FILE (default ./data/issuer-keys.json, mode 0600). Seeded from the legacy
 * single key (AGENTGUARD_SIGNING_KEY or ./data/signing-key.pem) so existing receipts keep their kid.
 */
export class KeyRing implements IssuerSigner {
  private recs: IssuerKeyRecord[]; private path: string | null;
  constructor(recs: IssuerKeyRecord[], path: string | null) { this.recs = recs; this.path = path; if (!this.activeRec()) throw new Error("key ring has no active key"); }

  static load(path = process.env.AGENTGUARD_KEYRING_FILE ?? "./data/issuer-keys.json"): KeyRing {
    if (existsSync(path)) return new KeyRing(JSON.parse(readFileSync(path, "utf8")).keys, path);
    const seed = Signer.load();
    const pem = (seed as any).priv.export({ type: "pkcs8", format: "pem" }).toString();
    const ring = new KeyRing([{ kid: kidOf(seed.publicKeyPem()), created: null /* legacy key: creation time unknown, so no lower bound */, retired: null, private_pem: pem }], path);
    ring.save(); return ring;
  }
  static ephemeral(): KeyRing {
    const k = generateKeyPairSync("ed25519").privateKey; const s = new Signer(k);
    return new KeyRing([{ kid: kidOf(s.publicKeyPem()), created: new Date().toISOString(), retired: null, private_pem: k.export({ type: "pkcs8", format: "pem" }).toString() }], null);
  }
  private save() {
    if (!this.path) return;
    mkdirSync(dirname(this.path), { recursive: true });
    const tmp = this.path + ".tmp";
    writeFileSync(tmp, JSON.stringify({ v: 1, keys: this.recs }, null, 2), { mode: 0o600 });
    renameSync(tmp, this.path);
  }
  private activeRec() { return [...this.recs].reverse().find(r => !r.retired); }
  active(): Signer { return new Signer(createPrivateKey(this.activeRec()!.private_pem)); }
  activeKid(): string { return this.activeRec()!.kid; }
  sign(message: string): string { return this.active().sign(message); }
  publicKeyPem(): string { return this.active().publicKeyPem(); }

  /** Retire the active key (kept for verification) and start signing with a fresh one. */
  rotate(at = new Date()): { retired: string; active: string } {
    const cur = this.activeRec()!;
    const k = generateKeyPairSync("ed25519").privateKey; const s = new Signer(k);
    const next: IssuerKeyRecord = { kid: kidOf(s.publicKeyPem()), created: at.toISOString(), retired: null, private_pem: k.export({ type: "pkcs8", format: "pem" }).toString() };
    cur.retired = at.toISOString();
    this.recs.push(next); this.save();
    return { retired: cur.kid, active: next.kid };
  }
  jwks(): { keys: IssuerJwk[] } {
    return { keys: this.recs.map(r => {
      const pub = createPublicKey(createPrivateKey(r.private_pem));
      const jwk = pub.export({ format: "jwk" }) as any;
      return { kty: "OKP", crv: "Ed25519", x: jwk.x, kid: r.kid, alg: "EdDSA", use: "sig", status: r.retired ? "retired" : "active",
        created: r.created, retired: r.retired, public_key_pem: pub.export({ type: "spki", format: "pem" }).toString() } as IssuerJwk;
    }) };
  }
}
