from __future__ import annotations

from typing_extensions import NotRequired, TypedDict

from ..core import UNSET, Optional, OptionalNullable, SdkBaseModel
from .catalog_offer import CatalogOffer, CatalogOfferDict
from .mandate_fit import MandateFit, MandateFitDict


class CatalogProduct(SdkBaseModel):
    product_id: str
    """Use as the PayPal order item sku"""

    channel3_id: Optional[str] = UNSET
    title: str
    brand: OptionalNullable[str] = UNSET
    image: OptionalNullable[str] = UNSET
    category: OptionalNullable[str] = UNSET
    offers: list[CatalogOffer]
    best_offer: OptionalNullable[CatalogOffer] = UNSET
    """Cheapest in-stock offer within the mandate's currency and ceiling"""

    mandate_fit: Optional[MandateFit] = UNSET


class CatalogProductDict(TypedDict):
    product_id: str
    channel3_id: NotRequired[str]
    title: str
    brand: NotRequired[str | None]
    image: NotRequired[str | None]
    category: NotRequired[str | None]
    offers: list[CatalogOfferDict]
    best_offer: NotRequired[CatalogOfferDict | None]
    mandate_fit: NotRequired[MandateFitDict]
