from __future__ import annotations

from typing_extensions import TypedDict

from ..core import SdkBaseModel
from .check import Check, CheckDict
from .enums.decision import DecisionOrStr
from .risk_signal import RiskSignal, RiskSignalDict


class Evaluation(SdkBaseModel):
    decision: DecisionOrStr
    proposal_hash: str
    """sha256 of the canonical proposal"""

    amount_minor: int
    """Amount in minor units, from the PayPal order"""

    checks: list[Check]
    risk: list[RiskSignal]
    reasons: list[str]


class EvaluationDict(TypedDict):
    decision: DecisionOrStr
    proposal_hash: str
    amount_minor: int
    checks: list[CheckDict]
    risk: list[RiskSignalDict]
    reasons: list[str]
