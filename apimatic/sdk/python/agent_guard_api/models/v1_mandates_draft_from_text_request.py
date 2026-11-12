from __future__ import annotations

from typing_extensions import TypedDict

from ..core import SdkBaseModel


class V1MandatesDraftFromTextRequest(SdkBaseModel):
    user_id: str
    agent_id: str
    text: str


class V1MandatesDraftFromTextRequestDict(TypedDict):
    user_id: str
    agent_id: str
    text: str
