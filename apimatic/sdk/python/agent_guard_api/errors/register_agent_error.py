from __future__ import annotations

from dataclasses import dataclass
from typing import Final, TypeAlias

from ..core import ErrorMapper, RawError, decode_json
from ..models.error_response import ErrorResponse

RegisterAgentErrorBody: TypeAlias = ErrorResponse | RawError


@dataclass(frozen=True, slots=True)
class _RegisterAgentError:
    def map(self, status_code: int, content: bytes) -> RegisterAgentErrorBody:
        match status_code:
            case 400 | 401 | 404 | 413 | 500:
                return decode_json[ErrorResponse](content)
            case _:
                return RawError(status_code, content)


register_agent_error_mapper: Final[ErrorMapper[RegisterAgentErrorBody]] = _RegisterAgentError()
