from __future__ import annotations

from pydantic import Field
from typing_extensions import NotRequired, TypedDict

from ..core import UNSET, Optional, SdkBaseModel


class AuditVerification(SdkBaseModel):
    ok: bool
    length: int
    broken_at: Optional[int] = Field(default=UNSET, alias="brokenAt")
    """First entry whose hash or link does not verify"""


class AuditVerificationDict(TypedDict):
    ok: bool
    length: int
    broken_at: NotRequired[int]
