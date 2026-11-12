from __future__ import annotations

from typing_extensions import NotRequired, TypedDict

from ..core import UNSET, Optional, SdkBaseModel


class PauseState(SdkBaseModel):
    paused: bool
    reason: Optional[str] = UNSET
    by: Optional[str] = UNSET
    since: Optional[str] = UNSET


class PauseStateDict(TypedDict):
    paused: bool
    reason: NotRequired[str]
    by: NotRequired[str]
    since: NotRequired[str]
