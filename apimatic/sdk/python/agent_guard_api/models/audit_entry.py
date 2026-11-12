from __future__ import annotations

from typing import Any

from typing_extensions import NotRequired, TypedDict

from ..core import UNSET, Optional, OptionalNullable, SdkBaseModel


class AuditEntry(SdkBaseModel):
    seq: int
    ts: str
    event: str
    ref: OptionalNullable[str] = UNSET
    payload: Optional[Any] = UNSET
    prev_hash: str
    hash: str
    """sha256(prev_hash|ts|event|ref|canonical(payload))"""


class AuditEntryDict(TypedDict):
    seq: int
    ts: str
    event: str
    ref: NotRequired[str | None]
    payload: NotRequired[Any]
    prev_hash: str
    hash: str
