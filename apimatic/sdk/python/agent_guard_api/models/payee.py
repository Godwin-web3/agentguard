from __future__ import annotations

from typing_extensions import NotRequired, TypedDict

from ..core import UNSET, Optional, SdkBaseModel


class Payee(SdkBaseModel):
    """Vaulted path only (untrusted)"""

    merchant_id: Optional[str] = UNSET
    email_address: Optional[str] = UNSET
    display_name: Optional[str] = UNSET


class PayeeDict(TypedDict):
    merchant_id: NotRequired[str]
    email_address: NotRequired[str]
    display_name: NotRequired[str]
