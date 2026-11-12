from __future__ import annotations

from dataclasses import dataclass
from typing import Final, TypeAlias

from ..core import ErrorMapper, RawError, decode_json
from ..models.error_response import ErrorResponse

GetRecoveryCancelOptionsErrorBody: TypeAlias = ErrorResponse | RawError


@dataclass(frozen=True, slots=True)
class _GetRecoveryCancelOptionsError:
    def map(self, status_code: int, content: bytes) -> GetRecoveryCancelOptionsErrorBody:
        match status_code:
            case 400 | 404 | 413 | 500:
                return decode_json[ErrorResponse](content)
            case _:
                return RawError(status_code, content)


get_recovery_cancel_options_error_mapper: Final[
    ErrorMapper[GetRecoveryCancelOptionsErrorBody]
] = _GetRecoveryCancelOptionsError()
