from __future__ import annotations

from typing_extensions import NotRequired, TypedDict

from ..core import UNSET, Optional, OptionalNullable, SdkBaseModel
from .catalog_product import CatalogProduct, CatalogProductDict


class ProductSearchResult(SdkBaseModel):
    provider: str
    mandate_id: Optional[str] = UNSET
    query: Optional[str] = UNSET
    max_price: str
    """Price ceiling applied: min(per-payment cap, remaining budget)"""

    currency: str
    products: list[CatalogProduct]
    next_page_token: OptionalNullable[str] = UNSET
    how_to_pay: Optional[str] = UNSET


class ProductSearchResultDict(TypedDict):
    provider: str
    mandate_id: NotRequired[str]
    query: NotRequired[str]
    max_price: str
    currency: str
    products: list[CatalogProductDict]
    next_page_token: NotRequired[str | None]
    how_to_pay: NotRequired[str]
