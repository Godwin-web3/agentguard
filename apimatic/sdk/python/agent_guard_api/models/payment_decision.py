from __future__ import annotations

from typing_extensions import NotRequired, TypedDict

from ..core import UNSET, Optional, OptionalNullable, SdkBaseModel
from .enums.decision import DecisionOrStr
from .enums.status import StatusOrStr
from .evaluation import Evaluation, EvaluationDict
from .paypal import Paypal, PaypalDict


class PaymentDecision(SdkBaseModel):
    payment_id: str
    decision: DecisionOrStr
    status: StatusOrStr
    evaluation: Evaluation
    approval_id: OptionalNullable[str] = UNSET
    """Set when the payment waits for the user's passkey approval"""

    paypal: Optional[Paypal] = UNSET
    error: OptionalNullable[str] = UNSET


class PaymentDecisionDict(TypedDict):
    payment_id: str
    decision: DecisionOrStr
    status: StatusOrStr
    evaluation: EvaluationDict
    approval_id: NotRequired[str | None]
    paypal: NotRequired[PaypalDict]
    error: NotRequired[str | None]
