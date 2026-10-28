import { canonical, sha256 } from "./canonical.ts";
import { textPdf } from "./pdf.ts";
import type { Envelope, VerifyResult } from "./verify.ts";

/**
 * Build a PayPal Disputes API provide-evidence payload from a verified receipt:
 *   POST /v1/customer/disputes/{id}/provide-evidence   (multipart: `input` JSON + one PDF file part)
 * The PDF carries a human summary, the verification result, and the full signed receipt (so it can be
 * re-verified from the document itself). This is evidence for PayPal's reviewers, not a guaranteed outcome.
 */
export interface DisputeEvidence {
  input: { evidences: { evidence_type: string; notes: string; documents: { name: string }[] }[] };
  files: { field: string; name: string; contentType: "application/pdf"; data: Buffer }[];
}

export function buildDisputeEvidence(env: Envelope, v: VerifyResult, opts: { evidenceType?: string } = {}): DisputeEvidence {
  const r = env.receipt; const s = v.summary; const m = r.mandate?.body ?? {};
  const name = `agentguard-proof-of-intent-${String(r.receipt_id).replace(/[^A-Za-z0-9_-]/g, "")}.pdf`;
  const notes = [
    `Authorized purchase by the buyer's AI agent under a spending mandate the buyer signed with their passkey (WebAuthn).`,
    `Order ${s?.order_id}, capture ${s?.capture_id}: ${s?.amount} ${s?.currency} to ${s?.payee}.`,
    `Mandate ${m.mandate_id} (user ${m.user_id}, agent ${m.agent_id}) purpose: "${String(m.purpose ?? "").slice(0, 200)}"; limit ${m.constraints?.max_total} ${m.constraints?.currency}; valid ${m.created_at} to ${m.expires_at}.`,
    `The passkey signature covers the mandate hash; the order matched every mandate rule before capture.`,
    `Independent verification: ${v.checks.filter(c => c.pass).length}/${v.checks.length} checks passed${v.trusted_issuer ? " with a pinned issuer key" : ""}. Receipt ${r.receipt_id}, sha256 ${sha256(canonical(r)).slice(0, 16)}. Full signed receipt in the attached PDF.`,
  ].join(" ").slice(0, 2000);
  const lines = [
    "AGENTGUARD PROOF-OF-INTENT RECEIPT: DISPUTE EVIDENCE", "",
    `Receipt id:     ${r.receipt_id}   (schema ${r.schema})`,
    `Issuer:         ${r.issuer?.name}  key ${env.signature.key_id}`,
    `PayPal order:   ${s?.order_id}`, `Capture:        ${s?.capture_id}  at ${s?.captured_at}`,
    `Amount:         ${s?.amount} ${s?.currency}`, `Payee:          ${s?.payee}`,
    `Buyer (user):   ${m.user_id}    Agent: ${m.agent_id}`,
    `Mandate:        ${m.mandate_id}  hash ${r.mandate?.hash}`, `Purpose:        ${m.purpose}`,
    `Constraints:    ${JSON.stringify(m.constraints)}`, `Valid:          ${m.created_at} -> ${m.expires_at}`,
    `Passkey:        credential ${r.mandate?.passkey?.credential_id}  (rp ${r.issuer?.webauthn_rp_id})`,
    `Decision:       ${r.decision?.decision} at ${r.decision?.evaluated_at}${r.approval ? `; human approval ${r.approval.resolution} by ${r.approval.approver}` : ""}`,
    "", "WHAT THIS SHOWS",
    "The buyer created a passkey-signed spending mandate for their AI agent. The PayPal order below was read",
    "from PayPal by AgentGuard, checked against every mandate rule, and only then authorized and captured.",
    "The receipt is signed by the issuer (Ed25519) and can be re-verified offline with",
    "@agentguard/intent-verifier: `intent-verify receipt.json` (JSON is reproduced in full below).",
    "This is evidence of authorization. It does not by itself guarantee any dispute outcome.",
    "", `INDEPENDENT VERIFICATION (${v.ok ? "ALL CHECKS PASSED" : "SOME CHECKS FAILED"})`,
    ...v.checks.map(c => `  [${c.pass ? "PASS" : "FAIL"}] ${c.check}: ${c.detail}`),
    ...v.warnings.map(w => `  note: ${w}`),
    "", "SIGNED RECEIPT (JSON)", ...JSON.stringify(env, null, 1).split("\n"),
  ];
  return {
    input: { evidences: [{ evidence_type: opts.evidenceType ?? "PROOF_OF_RECEIPT_COPY", notes, documents: [{ name }] }] },
    files: [{ field: "file1", name, contentType: "application/pdf", data: textPdf(lines) }],
  };
}

/** Submit evidence with the merchant's own PayPal credentials. Returns PayPal's HTTP status and body verbatim. */
export async function submitDisputeEvidence(disputeId: string, ev: DisputeEvidence,
  o: { clientId: string; clientSecret: string; apiBase?: string; fetch?: typeof fetch }): Promise<{ status: number; body: any }> {
  const base = o.apiBase ?? "https://api-m.paypal.com"; const http = o.fetch ?? fetch;
  const t = await http(`${base}/v1/oauth2/token`, { method: "POST", body: "grant_type=client_credentials",
    headers: { authorization: "Basic " + Buffer.from(`${o.clientId}:${o.clientSecret}`).toString("base64"), "content-type": "application/x-www-form-urlencoded" } });
  if (!t.ok) return { status: t.status, body: { error: "token request failed" } };
  const token = (await t.json() as any).access_token;
  const form = new FormData();
  form.append("input", new Blob([JSON.stringify(ev.input)], { type: "application/json" }));
  for (const f of ev.files) form.append(f.field, new Blob([new Uint8Array(f.data)], { type: f.contentType }), f.name);
  const res = await http(`${base}/v1/customer/disputes/${encodeURIComponent(disputeId)}/provide-evidence`, { method: "POST", headers: { authorization: `Bearer ${token}` }, body: form });
  const text = await res.text(); let body: any = text; try { body = JSON.parse(text); } catch {}
  return { status: res.status, body };
}
