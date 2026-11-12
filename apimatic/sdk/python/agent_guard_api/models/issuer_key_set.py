from __future__ import annotations

from typing_extensions import NotRequired, TypedDict

from ..core import UNSET, Optional, SdkBaseModel
from .issuer_key import IssuerKey, IssuerKeyDict


class IssuerKeySet(SdkBaseModel):
    issuer: Optional[str] = UNSET
    keys: list[IssuerKey]


class IssuerKeySetDict(TypedDict):
    issuer: NotRequired[str]
    keys: list[IssuerKeyDict]
