from __future__ import annotations

from dataclasses import dataclass
from typing import Final, TypeAlias

from ..core import ErrorMapper, RawError, decode_json
from ..models.error_response import ErrorResponse

EnrollPasskeyErrorBody: TypeAlias = ErrorResponse | RawError


@dataclass(frozen=True, slots=True)
class _EnrollPasskeyError:
    def map(self, status_code: int, content: bytes) -> EnrollPasskeyErrorBody:
        match status_code:
            case 400 | 404 | 413 | 500:
                return decode_json[ErrorResponse](content)
            case _:
                return RawError(status_code, content)


enroll_passkey_error_mapper: Final[ErrorMapper[EnrollPasskeyErrorBody]] = _EnrollPasskeyError()
