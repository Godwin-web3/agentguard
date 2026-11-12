from __future__ import annotations

from typing_extensions import NotRequired, TypedDict

from ..core import UNSET, Optional, SdkBaseModel
from .check import Check, CheckDict


class MandateFit(SdkBaseModel):
    fits: Optional[bool] = UNSET
    needs_approval: Optional[bool] = UNSET
    checks: Optional[list[Check]] = UNSET


class MandateFitDict(TypedDict):
    fits: NotRequired[bool]
    needs_approval: NotRequired[bool]
    checks: NotRequired[list[CheckDict]]
