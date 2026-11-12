from __future__ import annotations

from typing import Any
from uuid import UUID, uuid4

from ..core import (
    ApiResult,
    AsyncRawClient,
    BaseRawResponse,
    RawClient,
    RequestOptionsOrDict,
    async_empty_response,
    async_json_decoder,
    empty_response,
    json_decoder,
    param,
    unwrap,
)
from ..errors.get_health_error import GetHealthErrorBody, get_health_error_mapper
from ..errors.get_liveness_error import GetLivenessErrorBody, get_liveness_error_mapper
from ..errors.head_liveness_error import HeadLivenessErrorBody, head_liveness_error_mapper
from ..models.health import Health
from ..server.server import Server


class Meta:
    def __init__(self, client: RawClient, server: Server) -> None:
        self._with_raw_response = MetaWithRawResponse(client, server)

    def get_health(self, *, request_options: RequestOptionsOrDict | None = None) -> Health:
        """Health: ok, stuck payment count, last recovery run

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Not found Body over 256 KB Internal error ``error`` is ``ErrorResponse |
                RawError``."""
        return unwrap(self._with_raw_response.get_health(request_options=request_options))

    def get_liveness(self, *, request_options: RequestOptionsOrDict | None = None) -> Any:
        """Liveness probe (plain 200)

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Not found Body over 256 KB Internal error ``error`` is ``ErrorResponse |
                RawError``."""
        return unwrap(self._with_raw_response.get_liveness(request_options=request_options))

    def head_liveness(self, *, request_options: RequestOptionsOrDict | None = None) -> None:
        """Liveness probe, no body

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Not found Body over 256 KB Internal error ``error`` is ``RawError``."""
        return unwrap(self._with_raw_response.head_liveness(request_options=request_options))

    @property
    def with_raw_response(self) -> MetaWithRawResponse:
        return self._with_raw_response


class AsyncMeta:
    def __init__(self, client: AsyncRawClient, server: Server) -> None:
        self._with_raw_response = AsyncMetaWithRawResponse(client, server)

    async def get_health(self, *, request_options: RequestOptionsOrDict | None = None) -> Health:
        """Health: ok, stuck payment count, last recovery run

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Not found Body over 256 KB Internal error ``error`` is ``ErrorResponse |
                RawError``."""
        return unwrap(await self._with_raw_response.get_health(request_options=request_options))

    async def get_liveness(self, *, request_options: RequestOptionsOrDict | None = None) -> Any:
        """Liveness probe (plain 200)

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Not found Body over 256 KB Internal error ``error`` is ``ErrorResponse |
                RawError``."""
        return unwrap(await self._with_raw_response.get_liveness(request_options=request_options))

    async def head_liveness(self, *, request_options: RequestOptionsOrDict | None = None) -> None:
        """Liveness probe, no body

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Not found Body over 256 KB Internal error ``error`` is ``RawError``."""
        return unwrap(await self._with_raw_response.head_liveness(request_options=request_options))

    @property
    def with_raw_response(self) -> AsyncMetaWithRawResponse:
        return self._with_raw_response


class MetaWithRawResponse(BaseRawResponse[RawClient, Server]):
    def get_health(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[Health, GetHealthErrorBody]:
        """Health: ok, stuck payment count, last recovery run

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="GET",
            url_template=self._server.default("/health"),
            decoder=json_decoder[Health],
            error_mapper=get_health_error_mapper,
            request_options=request_options,
        )

    def get_liveness(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[Any, GetLivenessErrorBody]:
        """Liveness probe (plain 200)

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="GET",
            url_template=self._server.default("/healthz"),
            decoder=json_decoder[Any],
            error_mapper=get_liveness_error_mapper,
            request_options=request_options,
        )

    def head_liveness(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, HeadLivenessErrorBody]:
        """Liveness probe, no body

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="HEAD",
            url_template=self._server.default("/healthz"),
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            decoder=empty_response,
            error_mapper=head_liveness_error_mapper,
            request_options=request_options,
        )


class AsyncMetaWithRawResponse(BaseRawResponse[AsyncRawClient, Server]):
    async def get_health(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[Health, GetHealthErrorBody]:
        """Health: ok, stuck payment count, last recovery run

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="GET",
            url_template=self._server.default("/health"),
            decoder=async_json_decoder[Health],
            error_mapper=get_health_error_mapper,
            request_options=request_options,
        )

    async def get_liveness(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[Any, GetLivenessErrorBody]:
        """Liveness probe (plain 200)

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="GET",
            url_template=self._server.default("/healthz"),
            decoder=async_json_decoder[Any],
            error_mapper=get_liveness_error_mapper,
            request_options=request_options,
        )

    async def head_liveness(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[None, HeadLivenessErrorBody]:
        """Liveness probe, no body

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="HEAD",
            url_template=self._server.default("/healthz"),
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            decoder=async_empty_response,
            error_mapper=head_liveness_error_mapper,
            request_options=request_options,
        )
