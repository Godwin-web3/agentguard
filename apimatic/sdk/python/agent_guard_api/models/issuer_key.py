from __future__ import annotations

from typing_extensions import NotRequired, TypedDict

from ..core import UNSET, Optional, OptionalNullable, SdkBaseModel


class IssuerKey(SdkBaseModel):
    kid: str
    kty: Optional[str] = UNSET
    crv: Optional[str] = UNSET
    x: Optional[str] = UNSET
    public_key_pem: Optional[str] = UNSET
    status: Optional[str] = UNSET
    created: Optional[str] = UNSET
    retired: OptionalNullable[str] = UNSET
    compromised_at: OptionalNullable[str] = UNSET


class IssuerKeyDict(TypedDict):
    kid: str
    kty: NotRequired[str]
    crv: NotRequired[str]
    x: NotRequired[str]
    public_key_pem: NotRequired[str]
    status: NotRequired[str]
    created: NotRequired[str]
    retired: NotRequired[str | None]
    compromised_at: NotRequired[str | None]
