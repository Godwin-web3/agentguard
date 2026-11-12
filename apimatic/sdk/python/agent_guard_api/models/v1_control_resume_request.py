from __future__ import annotations

from typing_extensions import NotRequired, TypedDict

from ..core import UNSET, Optional, SdkBaseModel


class V1ControlResumeRequest(SdkBaseModel):
    by: Optional[str] = UNSET


class V1ControlResumeRequestDict(TypedDict):
    by: NotRequired[str]
