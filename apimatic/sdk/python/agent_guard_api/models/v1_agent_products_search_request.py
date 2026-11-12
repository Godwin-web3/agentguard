from __future__ import annotations

from typing_extensions import NotRequired, TypedDict

from ..core import UNSET, Optional, SdkBaseModel


class V1AgentProductsSearchRequest(SdkBaseModel):
    mandate_id: str
    query: str
    limit: Optional[int] = UNSET
    """1-30, default 8"""

    page_token: Optional[str] = UNSET
    """next_page_token from a previous search"""


class V1AgentProductsSearchRequestDict(TypedDict):
    mandate_id: str
    query: str
    limit: NotRequired[int]
    page_token: NotRequired[str]
