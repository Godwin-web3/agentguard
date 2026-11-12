from __future__ import annotations

from typing import Any

from typing_extensions import NotRequired, TypedDict

from ..core import UNSET, Optional, SdkBaseModel


class V1ApprovalsRequest(SdkBaseModel):
    approve: bool
    assertion: Any
    """WebAuthn assertion (navigator.credentials.get response, JSON-encoded) over the challenge returned by the matching
    *-request call"""

    approver: Optional[str] = UNSET


class V1ApprovalsRequestDict(TypedDict):
    approve: bool
    assertion: Any
    approver: NotRequired[str]
