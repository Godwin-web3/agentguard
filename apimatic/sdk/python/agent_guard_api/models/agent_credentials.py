from __future__ import annotations

from typing_extensions import TypedDict

from ..core import SdkBaseModel


class AgentCredentials(SdkBaseModel):
    agent_id: str
    api_key: str
    """Shown once; store it as the agent's secret"""


class AgentCredentialsDict(TypedDict):
    agent_id: str
    api_key: str
