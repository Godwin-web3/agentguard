from __future__ import annotations

from typing_extensions import TypedDict

from ..core import SdkBaseModel


class V1ApprovalsRequestRequest(SdkBaseModel):
    approve: bool


class V1ApprovalsRequestRequestDict(TypedDict):
    approve: bool
