from __future__ import annotations

from typing_extensions import NotRequired, TypedDict

from ..core import UNSET, Optional, OptionalNullable, SdkBaseModel


class CatalogOffer(SdkBaseModel):
    domain: str
    url: Optional[str] = UNSET
    """Retailer buy link"""

    price: str
    price_minor: Optional[int] = UNSET
    currency: str
    availability: Optional[str] = UNSET
    condition: OptionalNullable[str] = UNSET
    """new, used, refurbished; null when unknown"""


class CatalogOfferDict(TypedDict):
    domain: str
    url: NotRequired[str]
    price: str
    price_minor: NotRequired[int]
    currency: str
    availability: NotRequired[str]
    condition: NotRequired[str | None]
