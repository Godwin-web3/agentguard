from __future__ import annotations

from typing_extensions import NotRequired, TypedDict

from ..core import UNSET, Optional, SdkBaseModel


class V1RecoverRequest(SdkBaseModel):
    older_than_ms: Optional[int] = UNSET


class V1RecoverRequestDict(TypedDict):
    older_than_ms: NotRequired[int]
