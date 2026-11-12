from __future__ import annotations

from typing_extensions import TypedDict

from ..core import SdkBaseModel
from .enums.severity import SeverityOrStr


class RiskSignal(SdkBaseModel):
    signal: str
    severity: SeverityOrStr
    detail: str


class RiskSignalDict(TypedDict):
    signal: str
    severity: SeverityOrStr
    detail: str
