from __future__ import annotations

from typing_extensions import TypedDict

from ..core import SdkBaseModel


class ErrorResponse(SdkBaseModel):
    """Every non-2xx response"""

    error: str
    """What went wrong"""


class ErrorResponseDict(TypedDict):
    error: str
