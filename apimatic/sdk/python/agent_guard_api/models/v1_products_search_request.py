from __future__ import annotations

from typing_extensions import NotRequired, TypedDict

from ..core import UNSET, Optional, SdkBaseModel


class V1ProductsSearchRequest(SdkBaseModel):
    mandate_id: str
    query: str
    limit: Optional[int] = UNSET
    page_token: Optional[str] = UNSET


class V1ProductsSearchRequestDict(TypedDict):
    mandate_id: str
    query: str
    limit: NotRequired[int]
    page_token: NotRequired[str]
