from __future__ import annotations

from typing import Any

from typing_extensions import NotRequired, TypedDict

from ..core import UNSET, OptionalNullable, SdkBaseModel


class Health(SdkBaseModel):
    ok: bool
    stuck: int
    """Payments stuck in reserved/authorized for over a minute"""

    last_recovery: OptionalNullable[Any] = UNSET
    """Last reconciliation run"""


class HealthDict(TypedDict):
    ok: bool
    stuck: int
    last_recovery: NotRequired[Any | None]
