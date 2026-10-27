import { generateKeyPairSync, createPrivateKey, createPublicKey, sign, verify, type KeyObject } from "node:crypto";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
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
