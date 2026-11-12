from __future__ import annotations

from typing_extensions import NotRequired, TypedDict

from ..core import UNSET, Optional, SdkBaseModel


class ReceiptSummary(SdkBaseModel):
    receipt_id: str
    payment_id: str
    capture_id: Optional[str] = UNSET
    receipt_hash: Optional[str] = UNSET
    issued_at: Optional[str] = UNSET


class ReceiptSummaryDict(TypedDict):
    receipt_id: str
    payment_id: str
    capture_id: NotRequired[str]
    receipt_hash: NotRequired[str]
    issued_at: NotRequired[str]
