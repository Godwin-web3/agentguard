import { generateKeyPairSync, createPrivateKey, createPublicKey, createHash, createCipheriv, createDecipheriv, randomBytes, sign, verify, type KeyObject } from "node:crypto";
import type { Sql } from "./db.ts";
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

export interface IssuerKeyRecord { kid: string; created: string | null; retired: string | null; compromised_at?: string | null; private_pem: string }
/** Public view of one issuer key, JWKS-style (RFC 8037 OKP/Ed25519) plus lifecycle dates. */
export interface IssuerJwk { kty: "OKP"; crv: "Ed25519"; x: string; kid: string; alg: "EdDSA"; use: "sig";
  status: "active" | "retired" | "compromised"; created: string | null; retired: string | null; compromised_at: string | null; public_key_pem: string }

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
  private db: { sql: Sql; master: Buffer; loadedAt: number } | null = null;
  constructor(recs: IssuerKeyRecord[], path: string | null) { this.recs = recs; this.path = path; if (!this.activeRec()) throw new Error("key ring has no active key"); }

  /**
   * Serverless key ring: records live in the issuer_keys table, private keys AES-256-GCM encrypted under
   * AGENTGUARD_KEYRING_KEY (an env secret; never on disk, never in the DB). Seeded once from AGENTGUARD_SIGNING_KEY.
   */
  static async fromDb(sql: Sql, masterSecret = process.env.AGENTGUARD_KEYRING_KEY): Promise<KeyRing> {
    if (!masterSecret || masterSecret.length < 32) throw new Error("AGENTGUARD_KEYRING_KEY (>=32 chars) is required for the database key ring");
    const master = createHash("sha256").update("agentguard-keyring-v1|" + masterSecret).digest();
    sql.ddl(`CREATE TABLE IF NOT EXISTS issuer_keys (kid TEXT PRIMARY KEY, ord INTEGER NOT NULL, created TEXT, retired TEXT, compromised_at TEXT, enc_private TEXT NOT NULL)`);
    let recs = await KeyRing.readDb(sql, master);
    if (!recs.length) {
      const pem = process.env.AGENTGUARD_SIGNING_KEY;
      if (!pem) throw new Error("AGENTGUARD_SIGNING_KEY (Ed25519 PKCS#8 PEM) is required to seed the database key ring");
      const s = new Signer(createPrivateKey(pem));
      const rec: IssuerKeyRecord = { kid: kidOf(s.publicKeyPem()), created: new Date().toISOString(), retired: null, private_pem: createPrivateKey(pem).export({ type: "pkcs8", format: "pem" }).toString() };
      await sql.tx(async () => { await sql.prepare("INSERT INTO issuer_keys (kid,ord,created,retired,compromised_at,enc_private) VALUES (?,?,?,?,?,?) ON CONFLICT(kid) DO NOTHING")
        .run(rec.kid, 0, rec.created, null, null, seal(master, rec.kid, rec.private_pem)); });
      recs = await KeyRing.readDb(sql, master);
    }
    const ring = new KeyRing(recs, null); ring.db = { sql, master, loadedAt: Date.now() };
    return ring;
  }
  private static async readDb(sql: Sql, master: Buffer): Promise<IssuerKeyRecord[]> {
    return (await sql.prepare("SELECT * FROM issuer_keys ORDER BY ord").all()).map(r => ({ kid: r.kid, created: r.created ?? null, retired: r.retired ?? null,
      compromised_at: r.compromised_at ?? null, private_pem: open(master, r.kid, r.enc_private) }));
  }
  /** Pick up rotations made by other instances (at most every maxAgeMs). */
  async refresh(maxAgeMs = 10_000): Promise<void> {
    if (!this.db || Date.now() - this.db.loadedAt < maxAgeMs) return;
    const recs = await KeyRing.readDb(this.db.sql, this.db.master);
    if (recs.length) this.recs = recs;
    this.db.loadedAt = Date.now();
  }

  static load(path = process.env.AGENTGUARD_KEYRING_FILE ?? "./data/issuer-keys.json"): KeyRing {
    if (existsSync(path)) return new KeyRing(JSON.parse(readFileSync(path, "utf8")).keys, path);
    const seed = Signer.load();
    const pem = (seed as any).priv.export({ type: "pkcs8", format: "pem" }).toString();
    const ring = new KeyRing([{ kid: kidOf(seed.publicKeyPem()), created: null /* legacy key: creation time unknown, so no lower bound */, retired: null, private_pem: pem }], path);
    void ring.save(); return ring;
  }
  static ephemeral(): KeyRing {
    const k = generateKeyPairSync("ed25519").privateKey; const s = new Signer(k);
    return new KeyRing([{ kid: kidOf(s.publicKeyPem()), created: new Date().toISOString(), retired: null, private_pem: k.export({ type: "pkcs8", format: "pem" }).toString() }], null);
  }
  private async save(): Promise<void> {
    if (this.db) {
      const { sql, master } = this.db;
      await sql.tx(async () => {
        for (const [i, r] of this.recs.entries()) await sql.prepare(`INSERT INTO issuer_keys (kid,ord,created,retired,compromised_at,enc_private) VALUES (?,?,?,?,?,?)
          ON CONFLICT(kid) DO UPDATE SET retired=excluded.retired, compromised_at=excluded.compromised_at`).run(r.kid, i, r.created, r.retired, r.compromised_at ?? null, seal(master, r.kid, r.private_pem));
      });
      this.db.loadedAt = Date.now();
      return;
    }
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
  async rotate(at = new Date()): Promise<{ retired: string; active: string }> {
    await this.refresh(0);
    const cur = this.activeRec()!;
    const k = generateKeyPairSync("ed25519").privateKey; const s = new Signer(k);
    const next: IssuerKeyRecord = { kid: kidOf(s.publicKeyPem()), created: at.toISOString(), retired: null, private_pem: k.export({ type: "pkcs8", format: "pem" }).toString() };
    cur.retired = at.toISOString();
    this.recs.push(next); await this.save();
    return { retired: cur.kid, active: next.kid };
  }
  /**
   * Declare a key compromised as of `at` (default now). If it is the active key, rotate first. Verifiers then reject
   * anything signed by it unless an independent RFC 3161 timestamp proves the receipt existed before `at`
   * (the attacker can backdate issued_at, but cannot backdate a TSA's genTime).
   */
  async markCompromised(kid: string, at = new Date()): Promise<{ kid: string; compromised_at: string; active: string }> {
    await this.refresh(0);
    const rec = this.recs.find(r => r.kid === kid);
    if (!rec) throw Object.assign(new Error(`unknown kid ${kid}`), { code: 404 });
    if (!rec.retired) await this.rotate(at);
    const iso = at.toISOString();
    rec.compromised_at = rec.compromised_at && rec.compromised_at < iso ? rec.compromised_at : iso;
    await this.save();
    return { kid, compromised_at: rec.compromised_at, active: this.activeKid() };
  }
  jwks(): { keys: IssuerJwk[] } {
    return { keys: this.recs.map(r => {
      const pub = createPublicKey(createPrivateKey(r.private_pem));
      const jwk = pub.export({ format: "jwk" }) as any;
      return { kty: "OKP", crv: "Ed25519", x: jwk.x, kid: r.kid, alg: "EdDSA", use: "sig", status: r.compromised_at ? "compromised" : r.retired ? "retired" : "active",
        created: r.created, retired: r.retired, compromised_at: r.compromised_at ?? null, public_key_pem: pub.export({ type: "spki", format: "pem" }).toString() } as IssuerJwk;
    }) };
  }
}

function seal(master: Buffer, kid: string, pem: string): string {
  const iv = randomBytes(12); const c = createCipheriv("aes-256-gcm", master, iv); c.setAAD(Buffer.from(kid));
  const ct = Buffer.concat([c.update(pem, "utf8"), c.final()]);
  return "v1." + Buffer.concat([iv, c.getAuthTag(), ct]).toString("base64");
}
function open(master: Buffer, kid: string, enc: string): string {
  if (!enc.startsWith("v1.")) throw new Error("unknown issuer key envelope");
  const b = Buffer.from(enc.slice(3), "base64");
  const d = createDecipheriv("aes-256-gcm", master, b.subarray(0, 12)); d.setAAD(Buffer.from(kid)); d.setAuthTag(b.subarray(12, 28));
  return Buffer.concat([d.update(b.subarray(28)), d.final()]).toString("utf8");
}
