from __future__ import annotations

from dataclasses import dataclass
from typing import Final, TypeAlias

from ..core import ErrorMapper, RawError, decode_json
from ..models.error_response import ErrorResponse

ProposePaymentErrorBody: TypeAlias = ErrorResponse | RawError


@dataclass(frozen=True, slots=True)
class _ProposePaymentError:
    def map(self, status_code: int, content: bytes) -> ProposePaymentErrorBody:
        match status_code:
            case 400 | 401 | 404 | 413 | 429 | 500 | 503:
                return decode_json[ErrorResponse](content)
            case _:
                return RawError(status_code, content)


propose_payment_error_mapper: Final[ErrorMapper[ProposePaymentErrorBody]] = _ProposePaymentError()
