from __future__ import annotations

from typing_extensions import NotRequired, TypedDict

from ..core import UNSET, Optional, SdkBaseModel


class V1WalletsLinkRequest(SdkBaseModel):
    user_id: str
    vault_id: str
    payer_email: Optional[str] = UNSET


class V1WalletsLinkRequestDict(TypedDict):
    user_id: str
    vault_id: str
    payer_email: NotRequired[str]
