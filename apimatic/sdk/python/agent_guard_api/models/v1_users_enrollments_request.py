from __future__ import annotations

from typing_extensions import NotRequired, TypedDict

from ..core import UNSET, Optional, SdkBaseModel


class V1UsersEnrollmentsRequest(SdkBaseModel):
    issued_by: Optional[str] = UNSET
    ttl_minutes: Optional[int] = UNSET


class V1UsersEnrollmentsRequestDict(TypedDict):
    issued_by: NotRequired[str]
    ttl_minutes: NotRequired[int]
