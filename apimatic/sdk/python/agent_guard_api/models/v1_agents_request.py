from __future__ import annotations

from typing_extensions import TypedDict

from ..core import SdkBaseModel


class V1AgentsRequest(SdkBaseModel):
    user_id: str
    """Owner user id"""

    agent_id: str
    """Agent id"""


class V1AgentsRequestDict(TypedDict):
    user_id: str
    agent_id: str
