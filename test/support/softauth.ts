/** Software WebAuthn authenticator (ES256, "none" attestation) for tests. Behaves like a platform passkey. */
import { generateKeyPairSync, createHash, createPrivateKey, sign, randomBytes, type KeyObject } from "node:crypto";
import { isoCBOR } from "@simplewebauthn/server/helpers";

const b64u = (b: Uint8Array) => Buffer.from(b).toString("base64url");
export class SoftAuthenticator {
  priv: KeyObject; credId = randomBytes(16); counter = 0; rpID: string; origin: string; uv = true;
  constructor(rpID = "localhost", origin = "http://localhost:8787") {
    this.rpID = rpID; this.origin = origin; this.priv = generateKeyPairSync("ec", { namedCurve: "P-256" }).privateKey;
  }
  get id() { return b64u(this.credId); }
  toJSON() { return { pem: this.priv.export({ type: "pkcs8", format: "pem" }), credId: this.id, counter: this.counter, rpID: this.rpID, origin: this.origin }; }
  static fromJSON(j: any) {
    const a = new SoftAuthenticator(j.rpID, j.origin); a.priv = createPrivateKey(j.pem); a.credId = Buffer.from(j.credId, "base64url"); a.counter = j.counter; return a;
  }
  private authData(extra?: Buffer) {
    const flags = 0x01 | (this.uv ? 0x04 : 0) | (extra ? 0x40 : 0);
    const cnt = Buffer.alloc(4); cnt.writeUInt32BE(this.counter);
    return Buffer.concat([createHash("sha256").update(this.rpID).digest(), Buffer.from([flags]), cnt, ...(extra ? [extra] : [])]);
  }
  register(options: { challenge: string }) {
    const jwk = this.priv.export({ format: "jwk" }) as any;
    const cose = isoCBOR.encode(new Map<number, any>([[1, 2], [3, -7], [-1, 1], [-2, Buffer.from(jwk.x, "base64url")], [-3, Buffer.from(jwk.y, "base64url")]]));
    const len = Buffer.alloc(2); len.writeUInt16BE(this.credId.length);
    const ad = this.authData(Buffer.concat([Buffer.alloc(16), len, this.credId, Buffer.from(cose)]));
    const att = isoCBOR.encode(new Map<string, any>([["fmt", "none"], ["attStmt", new Map()], ["authData", ad]]));
    const cdj = Buffer.from(JSON.stringify({ type: "webauthn.create", challenge: options.challenge, origin: this.origin }));
    return { id: this.id, rawId: this.id, type: "public-key" as const, clientExtensionResults: {},
      response: { clientDataJSON: b64u(cdj), attestationObject: b64u(att), transports: ["internal" as const] } };
  }
  /** Sign an arbitrary challenge, as navigator.credentials.get would. */
  assert(challenge: string, origin = this.origin) {
    this.counter++;
    const ad = this.authData();
    const cdj = Buffer.from(JSON.stringify({ type: "webauthn.get", challenge, origin }));
    const sig = sign("sha256", Buffer.concat([ad, createHash("sha256").update(cdj).digest()]), this.priv);
    return { id: this.id, rawId: this.id, type: "public-key" as const, clientExtensionResults: {},
      response: { clientDataJSON: b64u(cdj), authenticatorData: b64u(ad), signature: b64u(sig) } };
  }
}
