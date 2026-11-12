from __future__ import annotations

from dataclasses import dataclass
from typing import Final, TypeAlias

from ..core import ErrorMapper, RawError, decode_json
from ..models.error_response import ErrorResponse

CancelRecoveryErrorBody: TypeAlias = ErrorResponse | RawError


@dataclass(frozen=True, slots=True)
class _CancelRecoveryError:
    def map(self, status_code: int, content: bytes) -> CancelRecoveryErrorBody:
        match status_code:
            case 400 | 404 | 413 | 500:
                return decode_json[ErrorResponse](content)
            case _:
                return RawError(status_code, content)


cancel_recovery_error_mapper: Final[ErrorMapper[CancelRecoveryErrorBody]] = _CancelRecoveryError()
