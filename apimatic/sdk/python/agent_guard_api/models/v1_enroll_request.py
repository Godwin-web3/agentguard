from __future__ import annotations

from typing import Any

from typing_extensions import TypedDict

from ..core import SdkBaseModel


class V1EnrollRequest(SdkBaseModel):
    token: str
    response: Any
    """navigator.credentials.create response"""


class V1EnrollRequestDict(TypedDict):
    token: str
    response: Any
