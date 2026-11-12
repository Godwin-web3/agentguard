from __future__ import annotations

from typing import Any

from typing_extensions import NotRequired, TypedDict

from ..core import UNSET, Optional, SdkBaseModel


class V1MandatesRevokeRequest(SdkBaseModel):
    assertion: Optional[Any] = UNSET
    """WebAuthn assertion (navigator.credentials.get response, JSON-encoded) over the challenge returned by the matching
    *-request call"""

    reason: Optional[str] = UNSET


class V1MandatesRevokeRequestDict(TypedDict):
    assertion: NotRequired[Any]
    reason: NotRequired[str]
