from __future__ import annotations

from typing_extensions import NotRequired, TypedDict

from ..core import UNSET, Optional, SdkBaseModel
from .mandate_constraints import MandateConstraints, MandateConstraintsDict


class V1MandatesRequest(SdkBaseModel):
    user_id: str
    agent_id: str
    purpose: str
    ttl_minutes: Optional[int] = UNSET
    constraints: Optional[MandateConstraints] = UNSET


class V1MandatesRequestDict(TypedDict):
    user_id: str
    agent_id: str
    purpose: str
    ttl_minutes: NotRequired[int]
    constraints: NotRequired[MandateConstraintsDict]
