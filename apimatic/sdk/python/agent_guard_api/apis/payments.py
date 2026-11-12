from __future__ import annotations

from typing import Any
from uuid import UUID, uuid4

from ..auth import AsyncAuthSchemes, AuthSchemes
from ..core import (
    ApiResult,
    AsyncRawClient,
    RawClient,
    RequestOptionsOrDict,
    SecuredRawResponse,
    async_json_decoder,
    json_body,
    json_decoder,
    param,
    unwrap,
)
from ..errors.list_payments_error import ListPaymentsErrorBody, list_payments_error_mapper
from ..errors.list_stuck_payments_error import ListStuckPaymentsErrorBody, list_stuck_payments_error_mapper
from ..errors.recover_payments_error import RecoverPaymentsErrorBody, recover_payments_error_mapper
from ..models.v1_recover_request import V1RecoverRequest, V1RecoverRequestDict
from ..server.server import Server


class Payments:
    def __init__(self, client: RawClient, server: Server, auth: AuthSchemes) -> None:
        self._with_raw_response = PaymentsWithRawResponse(client, server, auth)

    def list_payments(self, *, limit: str | None = None, request_options: RequestOptionsOrDict | None = None) -> Any:
        """List payments

        Args:
            limit: Default 200
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(self._with_raw_response.list_payments(limit=limit, request_options=request_options))

    def list_stuck_payments(
        self, *, older_than_ms: str | None = None, request_options: RequestOptionsOrDict | None = None
    ) -> Any:
        """Payments in reserved/authorized older than a threshold

        Args:
            older_than_ms: Default 60000
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(
            self._with_raw_response.list_stuck_payments(older_than_ms=older_than_ms, request_options=request_options)
        )

    def recover_payments(
        self,
        *,
        body: V1RecoverRequest | V1RecoverRequestDict | None = None,
        request_options: RequestOptionsOrDict | None = None,
    ) -> Any:
        """Converge stuck payments with PayPal now

        Args:
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(self._with_raw_response.recover_payments(body=body, request_options=request_options))

    @property
    def with_raw_response(self) -> PaymentsWithRawResponse:
        return self._with_raw_response


class AsyncPayments:
    def __init__(self, client: AsyncRawClient, server: Server, auth: AsyncAuthSchemes) -> None:
        self._with_raw_response = AsyncPaymentsWithRawResponse(client, server, auth)

    async def list_payments(
        self, *, limit: str | None = None, request_options: RequestOptionsOrDict | None = None
    ) -> Any:
        """List payments

        Args:
            limit: Default 200
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(await self._with_raw_response.list_payments(limit=limit, request_options=request_options))

    async def list_stuck_payments(
        self, *, older_than_ms: str | None = None, request_options: RequestOptionsOrDict | None = None
    ) -> Any:
        """Payments in reserved/authorized older than a threshold

        Args:
            older_than_ms: Default 60000
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(
            await self._with_raw_response.list_stuck_payments(
                older_than_ms=older_than_ms, request_options=request_options
            ),
        )

    async def recover_payments(
        self,
        *,
        body: V1RecoverRequest | V1RecoverRequestDict | None = None,
        request_options: RequestOptionsOrDict | None = None,
    ) -> Any:
        """Converge stuck payments with PayPal now

        Args:
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(await self._with_raw_response.recover_payments(body=body, request_options=request_options))

    @property
    def with_raw_response(self) -> AsyncPaymentsWithRawResponse:
        return self._with_raw_response


class PaymentsWithRawResponse(SecuredRawResponse[RawClient, Server, AuthSchemes]):
    def list_payments(
        self, *, limit: str | None = None, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[Any, ListPaymentsErrorBody]:
        """List payments

        Args:
            limit: Default 200
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="GET",
            url_template=self._server.default("/v1/payments"),
            query_params=[param[str | None]("limit", limit)],
            auth_scheme=self._auth.admin,
            decoder=json_decoder[Any],
            error_mapper=list_payments_error_mapper,
            request_options=request_options,
        )

    def list_stuck_payments(
        self, *, older_than_ms: str | None = None, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[Any, ListStuckPaymentsErrorBody]:
        """Payments in reserved/authorized older than a threshold

        Args:
            older_than_ms: Default 60000
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="GET",
            url_template=self._server.default("/v1/payments/stuck"),
            query_params=[param[str | None]("older_than_ms", older_than_ms)],
            auth_scheme=self._auth.admin,
            decoder=json_decoder[Any],
            error_mapper=list_stuck_payments_error_mapper,
            request_options=request_options,
        )

    def recover_payments(
        self,
        *,
        body: V1RecoverRequest | V1RecoverRequestDict | None = None,
        request_options: RequestOptionsOrDict | None = None,
    ) -> ApiResult[Any, RecoverPaymentsErrorBody]:
        """Converge stuck payments with PayPal now

        Args:
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="POST",
            url_template=self._server.default("/v1/recover"),
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            body=json_body[V1RecoverRequest | V1RecoverRequestDict | None](body),
            auth_scheme=self._auth.admin,
            decoder=json_decoder[Any],
            error_mapper=recover_payments_error_mapper,
            request_options=request_options,
        )


class AsyncPaymentsWithRawResponse(SecuredRawResponse[AsyncRawClient, Server, AsyncAuthSchemes]):
    async def list_payments(
        self, *, limit: str | None = None, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[Any, ListPaymentsErrorBody]:
        """List payments

        Args:
            limit: Default 200
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="GET",
            url_template=self._server.default("/v1/payments"),
            query_params=[param[str | None]("limit", limit)],
            auth_scheme=self._auth.admin,
            decoder=async_json_decoder[Any],
            error_mapper=list_payments_error_mapper,
            request_options=request_options,
        )

    async def list_stuck_payments(
        self, *, older_than_ms: str | None = None, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[Any, ListStuckPaymentsErrorBody]:
        """Payments in reserved/authorized older than a threshold

        Args:
            older_than_ms: Default 60000
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="GET",
            url_template=self._server.default("/v1/payments/stuck"),
            query_params=[param[str | None]("older_than_ms", older_than_ms)],
            auth_scheme=self._auth.admin,
            decoder=async_json_decoder[Any],
            error_mapper=list_stuck_payments_error_mapper,
            request_options=request_options,
        )

    async def recover_payments(
        self,
        *,
        body: V1RecoverRequest | V1RecoverRequestDict | None = None,
        request_options: RequestOptionsOrDict | None = None,
    ) -> ApiResult[Any, RecoverPaymentsErrorBody]:
        """Converge stuck payments with PayPal now

        Args:
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="POST",
            url_template=self._server.default("/v1/recover"),
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            body=json_body[V1RecoverRequest | V1RecoverRequestDict | None](body),
            auth_scheme=self._auth.admin,
            decoder=async_json_decoder[Any],
            error_mapper=recover_payments_error_mapper,
            request_options=request_options,
        )
