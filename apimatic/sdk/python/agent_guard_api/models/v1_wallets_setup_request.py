from __future__ import annotations

from typing_extensions import TypedDict

from ..core import SdkBaseModel


class V1WalletsSetupRequest(SdkBaseModel):
    user_id: str


class V1WalletsSetupRequestDict(TypedDict):
    user_id: str
