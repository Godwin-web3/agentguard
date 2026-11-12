from __future__ import annotations

from pydantic import Field
from typing_extensions import TypedDict

from ..core import SdkBaseModel


class Check(SdkBaseModel):
    check: str
    pass_: bool = Field(alias="pass")
    detail: str


class CheckDict(TypedDict):
    check: str
    pass_: bool
    detail: str
