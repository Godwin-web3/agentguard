import { test } from "node:test";
import assert from "node:assert/strict";
import { chooseEvidenceType, fetchDispute } from "../packages/intent-verifier/src/evidence.ts";

const link = { rel: "provide_evidence", href: "https://api-m.sandbox.paypal.com/v1/customer/disputes/PP-D-1/provide-evidence" };
const d = (o: any) => ({ dispute_id: "PP-D-1", status: "WAITING_FOR_SELLER_RESPONSE", reason: "MERCHANDISE_OR_SERVICE_NOT_RECEIVED", links: [link], evidences: [], ...o });

test("evidence type: uses the type PayPal REQUESTED_FROM_SELLER (most recent first), ignoring buyer/seller-submitted items", () => {
  const c = chooseEvidenceType(d({ evidences: [
    { evidence_type: "CREATE", source: "SUBMITTED_BY_BUYER", date: "2026-10-28T09:00:00Z" },
    { evidence_type: "PROOF_OF_RECEIPT_COPY", source: "REQUESTED_FROM_SELLER", date: "2026-10-28T09:01:00Z" },
    { evidence_type: "PROOF_OF_FULFILLMENT", source: "REQUESTED_FROM_SELLER", date: "2026-10-28T09:05:00Z" },
    { evidence_type: "OTHER", source: "SUBMITTED_BY_SELLER", date: "2026-10-28T09:06:00Z" }] }));
  assert.deepEqual([c.evidence_type, c.source, c.notes], ["PROOF_OF_FULFILLMENT", "requested_from_seller", []]);
});
test("evidence type: falls back by dispute reason, then to PROOF_OF_RECEIPT_COPY", () => {
  const r = chooseEvidenceType(d({}));
  assert.equal(r.evidence_type, "PROOF_OF_FULFILLMENT"); assert.equal(r.source, "reason_fallback");
  assert.equal(chooseEvidenceType(d({ reason: "MERCHANDISE_OR_SERVICE_NOT_AS_DESCRIBED" })).evidence_type, "ITEM_DESCRIPTION");
  assert.deepEqual([chooseEvidenceType(d({ reason: "SOMETHING_NEW" })).evidence_type, chooseEvidenceType(null).source], ["PROOF_OF_RECEIPT_COPY", "default"]);
});
test("evidence type: explicit override wins but is flagged if PayPal asked for something else; wrong status / no link noted", () => {
  const c = chooseEvidenceType(d({ status: "UNDER_REVIEW", links: [], evidences: [{ evidence_type: "PROOF_OF_FULFILLMENT", source: "REQUESTED_FROM_SELLER" }] }), "PROOF_OF_RECEIPT_COPY");
  assert.equal(c.evidence_type, "PROOF_OF_RECEIPT_COPY"); assert.equal(c.source, "explicit");
  assert.ok(c.notes.some(n => /UNDER_REVIEW/.test(n))); assert.ok(c.notes.some(n => /no provide-evidence link/.test(n)));
  assert.ok(c.notes.some(n => /requested PROOF_OF_FULFILLMENT, not PROOF_OF_RECEIPT_COPY/.test(n)));
});
test("evidence type: fetchDispute reads the dispute with merchant credentials (no secret in URL)", async () => {
  const calls: string[] = [];
  const http = (async (url: string, init: any) => {
    calls.push(url);
    if (url.endsWith("/v1/oauth2/token")) return new Response(JSON.stringify({ access_token: "tok" }));
    assert.equal(init.headers.authorization, "Bearer tok");
    return new Response(JSON.stringify(d({ evidences: [{ evidence_type: "PROOF_OF_FULFILLMENT", source: "REQUESTED_FROM_SELLER" }] })));
  }) as any;
  const got = await fetchDispute("PP-D-1", { clientId: "id", clientSecret: "secret", apiBase: "https://x", fetch: http });
  assert.equal(chooseEvidenceType(got).evidence_type, "PROOF_OF_FULFILLMENT");
  assert.deepEqual(calls, ["https://x/v1/oauth2/token", "https://x/v1/customer/disputes/PP-D-1"]);
  await assert.rejects(fetchDispute("PP-D-2", { clientId: "id", clientSecret: "s", apiBase: "https://x", fetch: (async () => new Response("no", { status: 401 })) as any }), /token request failed/);
});
