from __future__ import annotations

from dataclasses import dataclass
from typing import Final, TypeAlias

from ..core import ErrorMapper, RawError, decode_json
from ..models.error_response import ErrorResponse

ListAuditAnchorsErrorBody: TypeAlias = ErrorResponse | RawError


@dataclass(frozen=True, slots=True)
class _ListAuditAnchorsError:
    def map(self, status_code: int, content: bytes) -> ListAuditAnchorsErrorBody:
        match status_code:
            case 400 | 404 | 413 | 500:
                return decode_json[ErrorResponse](content)
            case _:
                return RawError(status_code, content)


list_audit_anchors_error_mapper: Final[ErrorMapper[ListAuditAnchorsErrorBody]] = _ListAuditAnchorsError()
