import { PasskeyService } from "../../src/passkeys.ts";
import { SoftAuthenticator } from "./softauth.ts";
import type { Store } from "../../src/store.ts";
import type { Gateway } from "../../src/gateway.ts";

export const RP = { rpID: "localhost", rpName: "AgentGuard test", origin: "http://localhost:8787" };

/** Passkey service plus one enrolled software authenticator per user, and a helper that signs mandates with it. */
export async function enrol(store: Store, users: string[] = ["u1"], extra: Record<string, unknown> = {}) {
  const passkeys = new PasskeyService(store, { ...RP, ...extra });
  const auths = new Map<string, SoftAuthenticator>();
  for (const u of users) {
    const a = new SoftAuthenticator(RP.rpID, RP.origin);
    const { token } = passkeys.issueEnrollment(u, { issuedBy: "test" });
    await passkeys.verifyRegistration(token, a.register(await passkeys.registrationOptions(token)) as any);
    auths.set(u, a);
  }
  return { passkeys, auths };
}
export function signer(gw: Gateway, auths: Map<string, SoftAuthenticator>) {
  return async (mandateId: string, hash: string) => {
    const req = await gw.signingRequest(mandateId);
    return gw.confirmMandate(mandateId, hash, auths.get(req.mandate.user_id)!.assert(req.options.challenge) as any);
  };
}
export async function revoker(gw: Gateway, auths: Map<string, SoftAuthenticator>, mandateId: string) {
  const req = await gw.revocationRequest(mandateId);
  const sm = await gw.mandateView(mandateId);
  return gw.revokeMandate(mandateId, auths.get(sm.mandate.user_id)!.assert(req.options.challenge) as any);
}
/** The user's passkey signs the approval statement for a held payment (approve or deny). */
export async function approver(gw: Gateway, auths: Map<string, SoftAuthenticator>, approvalId: string, approve = true, who = "user") {
  const req = await gw.approvalRequest(approvalId, approve);
  return gw.resolveApproval(approvalId, approve, auths.get(req.statement.user_id)!.assert(req.options.challenge) as any, who);
}
