from __future__ import annotations

from dataclasses import dataclass
from typing import Final, TypeAlias

from ..core import ErrorMapper, RawError, decode_json
from ..models.error_response import ErrorResponse

GetPublicReceiptErrorBody: TypeAlias = ErrorResponse | RawError


@dataclass(frozen=True, slots=True)
class _GetPublicReceiptError:
    def map(self, status_code: int, content: bytes) -> GetPublicReceiptErrorBody:
        match status_code:
            case 400 | 404 | 413 | 500:
                return decode_json[ErrorResponse](content)
            case _:
                return RawError(status_code, content)


get_public_receipt_error_mapper: Final[ErrorMapper[GetPublicReceiptErrorBody]] = _GetPublicReceiptError()
