from __future__ import annotations

from typing_extensions import NotRequired, TypedDict

from ..core import UNSET, Optional, SdkBaseModel


class Signature(SdkBaseModel):
    alg: str
    kid: Optional[str] = UNSET
    key_id: Optional[str] = UNSET
    public_key_pem: Optional[str] = UNSET
    value: str


class SignatureDict(TypedDict):
    alg: str
    kid: NotRequired[str]
    key_id: NotRequired[str]
    public_key_pem: NotRequired[str]
    value: str
