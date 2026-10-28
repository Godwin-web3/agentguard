---
title: Disputes
description: Where a receipt helps in a PayPal dispute, and where it does not.
---
# Disputes

A PayPal buyer can open an inquiry or dispute on any capture. The capture's `invoice_id` is `AGPOI-<receipt_id>`, so the merchant can always find the receipt that goes with it.

## What a receipt shows

- The buyer's own passkey signed a mandate allowing this payee, these SKUs and this amount.
- The order paid is exactly the order that mandate was checked against.
- If the payment was over the approval threshold, the buyer's passkey also approved this specific payment.
- When it was issued, from an independent timestamp, and that it is in the published audit history.

That is strong evidence against "I did not authorize this" (`UNAUTHORISED` style claims) and against an agent going rogue.

## What it does not show

Fulfilment. "Item not received" and "not as described" are about delivery and quality. Pair the receipt with your normal fulfilment evidence (tracking, download logs). No one can promise a dispute outcome; PayPal decides.

## Live sandbox proof

On 2026-10-28 a real receipt was submitted as seller evidence on sandbox dispute `PP-R-QXA-10194904` (buyer "item not received" inquiry; order `1TP01222A0976703C`, capture `4JE17312396274543`, 10.80 USD). `provide-evidence` returned HTTP 200 and the case moved from `WAITING_FOR_SELLER_RESPONSE` to `UNDER_REVIEW` with the receipt PDF attached. PayPal only accepted the evidence type it requested (`PROOF_OF_FULFILLMENT`); `intent-verify evidence --dispute <id>` now picks that type automatically. No outcome is claimed.

See [Dispute evidence](./dispute-evidence.md) for the commands.
