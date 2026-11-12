from __future__ import annotations

from typing_extensions import NotRequired, TypedDict

from ..core import UNSET, OptionalNullable, SdkBaseModel


class Paypal(SdkBaseModel):
    order_id: OptionalNullable[str] = UNSET
    authorization_id: OptionalNullable[str] = UNSET
    capture_id: OptionalNullable[str] = UNSET


class PaypalDict(TypedDict):
    order_id: NotRequired[str | None]
    authorization_id: NotRequired[str | None]
    capture_id: NotRequired[str | None]
