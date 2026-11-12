from __future__ import annotations

from typing_extensions import NotRequired, TypedDict

from ..core import UNSET, Optional, SdkBaseModel
from .enums.status1 import Status1OrStr
from .mandate import Mandate, MandateDict
from .spend import Spend, SpendDict


class AgentMandate(SdkBaseModel):
    mandate: Mandate
    status: Status1OrStr
    spend: Optional[Spend] = UNSET


class AgentMandateDict(TypedDict):
    mandate: MandateDict
    status: Status1OrStr
    spend: NotRequired[SpendDict]
