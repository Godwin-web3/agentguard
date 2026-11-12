from __future__ import annotations

from dataclasses import dataclass
from typing import Final, TypeAlias

from ..core import ErrorMapper, RawError

HeadLivenessErrorBody: TypeAlias = RawError


@dataclass(frozen=True, slots=True)
class _HeadLivenessError:
    def map(self, status_code: int, content: bytes) -> HeadLivenessErrorBody:
        match status_code:
            case 400 | 404 | 413 | 500:
                return RawError(status_code, content)
            case _:
                return RawError(status_code, content)


head_liveness_error_mapper: Final[ErrorMapper[HeadLivenessErrorBody]] = _HeadLivenessError()
