from __future__ import annotations

from typing import Any

from typing_extensions import NotRequired, TypedDict

from ..core import UNSET, Optional, SdkBaseModel
from .signature import Signature, SignatureDict


class ReceiptEnvelope(SdkBaseModel):
    receipt: Any
    """agentguard.proof-of-intent/v1 receipt: mandate + passkey signature, PayPal order snapshot, decision, capture"""

    signature: Signature
    timestamps: Optional[list[Any]] = UNSET
    anchor: Optional[Any] = UNSET
    """Merkle inclusion proof for the audit-chain anchor"""


class ReceiptEnvelopeDict(TypedDict):
    receipt: Any
    signature: SignatureDict
    timestamps: NotRequired[list[Any]]
    anchor: NotRequired[Any]
