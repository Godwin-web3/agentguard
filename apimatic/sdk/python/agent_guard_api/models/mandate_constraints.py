from __future__ import annotations

from typing_extensions import NotRequired, TypedDict

from ..core import UNSET, Optional, SdkBaseModel
from .enums.allowed_category import AllowedCategoryOrStr


class MandateConstraints(SdkBaseModel):
    currency: str
    """ISO 4217"""

    max_total: str
    max_per_transaction: Optional[str] = UNSET
    max_transactions: int
    allowed_categories: Optional[list[AllowedCategoryOrStr]] = UNSET
    payee_allowlist: Optional[list[str]] = UNSET
    payee_blocklist: Optional[list[str]] = UNSET
    max_quantity_per_item: Optional[int] = UNSET
    require_human_approval_over: Optional[str] = UNSET
    require_merchant_order: Optional[bool] = UNSET
    sku_allowlist: Optional[list[str]] = UNSET


class MandateConstraintsDict(TypedDict):
    currency: str
    max_total: str
    max_per_transaction: NotRequired[str]
    max_transactions: int
    allowed_categories: NotRequired[list[AllowedCategoryOrStr]]
    payee_allowlist: NotRequired[list[str]]
    payee_blocklist: NotRequired[list[str]]
    max_quantity_per_item: NotRequired[int]
    require_human_approval_over: NotRequired[str]
    require_merchant_order: NotRequired[bool]
    sku_allowlist: NotRequired[list[str]]
