from __future__ import annotations

from typing_extensions import NotRequired, TypedDict

from ..core import UNSET, Optional, SdkBaseModel


class V1KeysCompromisedRequest(SdkBaseModel):
    at: Optional[str] = UNSET
    """ISO time; default now"""


class V1KeysCompromisedRequestDict(TypedDict):
    at: NotRequired[str]
