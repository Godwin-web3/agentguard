from __future__ import annotations

from typing import Any

from typing_extensions import NotRequired, TypedDict

from ..core import UNSET, Optional, SdkBaseModel
from .context import Context, ContextDict
from .payee import Payee, PayeeDict


class V1AgentPaymentsRequest(SdkBaseModel):
    mandate_id: str
    agent_id: str
    idempotency_key: str
    paypal_order_id: Optional[str] = UNSET
    """Merchant-created AUTHORIZE order (preferred). Do not combine with payee/currency/items."""

    payee: Optional[Payee] = UNSET
    """Vaulted path only (untrusted)"""

    currency: Optional[str] = UNSET
    """Vaulted path only"""

    items: Optional[list[Any]] = UNSET
    """Vaulted path only (untrusted)"""

    context: Optional[list[Context]] = UNSET
    """Untrusted context the agent saw; scored for injection, advisory only"""

    agent_rationale: Optional[str] = UNSET


class V1AgentPaymentsRequestDict(TypedDict):
    mandate_id: str
    agent_id: str
    idempotency_key: str
    paypal_order_id: NotRequired[str]
    payee: NotRequired[PayeeDict]
    currency: NotRequired[str]
    items: NotRequired[list[Any]]
    context: NotRequired[list[ContextDict]]
    agent_rationale: NotRequired[str]
