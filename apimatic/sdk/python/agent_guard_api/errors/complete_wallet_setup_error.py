from __future__ import annotations

from dataclasses import dataclass
from typing import Final, TypeAlias

from ..core import ErrorMapper, RawError, decode_json
from ..models.error_response import ErrorResponse

CompleteWalletSetupErrorBody: TypeAlias = ErrorResponse | RawError


@dataclass(frozen=True, slots=True)
class _CompleteWalletSetupError:
    def map(self, status_code: int, content: bytes) -> CompleteWalletSetupErrorBody:
        match status_code:
            case 400 | 404 | 413 | 500:
                return decode_json[ErrorResponse](content)
            case _:
                return RawError(status_code, content)


complete_wallet_setup_error_mapper: Final[ErrorMapper[CompleteWalletSetupErrorBody]] = _CompleteWalletSetupError()
