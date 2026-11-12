from __future__ import annotations

from typing_extensions import NotRequired, TypedDict

from ..core import UNSET, Optional, SdkBaseModel


class Spend(SdkBaseModel):
    spent_minor: Optional[int] = UNSET
    reserved_minor: Optional[int] = UNSET
    tx_count: Optional[int] = UNSET


class SpendDict(TypedDict):
    spent_minor: NotRequired[int]
    reserved_minor: NotRequired[int]
    tx_count: NotRequired[int]
