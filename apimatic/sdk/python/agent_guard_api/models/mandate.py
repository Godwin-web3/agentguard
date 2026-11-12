from __future__ import annotations

from typing_extensions import NotRequired, TypedDict

from ..core import UNSET, Optional, SdkBaseModel
from .mandate_constraints import MandateConstraints, MandateConstraintsDict


class Mandate(SdkBaseModel):
    mandate_id: str
    user_id: str
    agent_id: str
    purpose: str
    constraints: MandateConstraints
    created_at: str
    expires_at: str
    version: Optional[int] = UNSET


class MandateDict(TypedDict):
    mandate_id: str
    user_id: str
    agent_id: str
    purpose: str
    constraints: MandateConstraintsDict
    created_at: str
    expires_at: str
    version: NotRequired[int]
