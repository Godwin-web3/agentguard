from __future__ import annotations

from typing import Any

from typing_extensions import TypedDict

from ..core import SdkBaseModel


class V1UsersRecoveryCancelRequest(SdkBaseModel):
    assertion: Any
    """WebAuthn assertion (navigator.credentials.get response, JSON-encoded) over the challenge returned by the matching
    *-request call"""


class V1UsersRecoveryCancelRequestDict(TypedDict):
    assertion: Any
