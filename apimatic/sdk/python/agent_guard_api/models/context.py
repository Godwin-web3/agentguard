from __future__ import annotations

from typing_extensions import NotRequired, TypedDict

from ..core import UNSET, Optional, SdkBaseModel


class Context(SdkBaseModel):
    source_url: Optional[str] = UNSET
    excerpt: Optional[str] = UNSET


class ContextDict(TypedDict):
    source_url: NotRequired[str]
    excerpt: NotRequired[str]
