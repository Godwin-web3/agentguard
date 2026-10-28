// Node's Buffer for the browser build of the verifier: the npm `buffer` polyfill plus base64url, which it lacks.
import { Buffer as B } from "buffer/";
const toB64 = (s: string) => s.replace(/-/g, "+").replace(/_/g, "/");
const from = B.from as any, toStr = B.prototype.toString;
(B as any).from = function (v: any, enc?: any, len?: any) { return enc === "base64url" ? from.call(B, toB64(String(v)), "base64") : from.call(B, v, enc, len); };
(B.prototype as any).toString = function (enc?: string, s?: number, e?: number) {
  return enc === "base64url" ? toStr.call(this, "base64", s, e).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "") : toStr.call(this, enc as any, s, e);
};
export const Buffer = B;
