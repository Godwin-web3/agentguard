from __future__ import annotations

from typing_extensions import NotRequired, TypedDict

from ..core import UNSET, Optional, SdkBaseModel


class V1ControlPauseRequest(SdkBaseModel):
    reason: Optional[str] = UNSET
    by: Optional[str] = UNSET


class V1ControlPauseRequestDict(TypedDict):
    reason: NotRequired[str]
    by: NotRequired[str]
