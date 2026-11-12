from __future__ import annotations

from typing_extensions import TypedDict

from ..core import SdkBaseModel


class V1EnrollOptionsRequest(SdkBaseModel):
    token: str


class V1EnrollOptionsRequestDict(TypedDict):
    token: str
