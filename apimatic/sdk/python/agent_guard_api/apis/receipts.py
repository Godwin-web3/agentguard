from __future__ import annotations

from ..auth import AsyncAuthSchemes, AuthSchemes
from ..core import (
    ApiResult,
    AsyncRawClient,
    RawClient,
    RequestOptionsOrDict,
    SecuredRawResponse,
    async_json_decoder,
    json_decoder,
    param,
    unwrap,
)
from ..errors.get_payment_receipt_error import GetPaymentReceiptErrorBody, get_payment_receipt_error_mapper
from ..errors.get_public_receipt_error import GetPublicReceiptErrorBody, get_public_receipt_error_mapper
from ..errors.get_receipt_error import GetReceiptErrorBody, get_receipt_error_mapper
from ..errors.list_receipts_error import ListReceiptsErrorBody, list_receipts_error_mapper
from ..models.receipt_envelope import ReceiptEnvelope
from ..models.receipt_summary import ReceiptSummary
from ..server.server import Server


class Receipts:
    def __init__(self, client: RawClient, server: Server, auth: AuthSchemes) -> None:
        self._with_raw_response = ReceiptsWithRawResponse(client, server, auth)

    def get_payment_receipt(self, id_: str, *, request_options: RequestOptionsOrDict | None = None) -> ReceiptEnvelope:
        """Receipt for a payment

        Args:
            id_: Value sent with the request.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(self._with_raw_response.get_payment_receipt(id_, request_options=request_options))

    def get_public_receipt(self, id_: str, *, request_options: RequestOptionsOrDict | None = None) -> ReceiptEnvelope:
        """Public receipt lookup (only when AGENTGUARD_PUBLIC_RECEIPTS=1)

        Args:
            id_: Value sent with the request.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Not found Body over 256 KB Internal error ``error`` is ``ErrorResponse |
                RawError``."""
        return unwrap(self._with_raw_response.get_public_receipt(id_, request_options=request_options))

    def get_receipt(self, id_: str, *, request_options: RequestOptionsOrDict | None = None) -> ReceiptEnvelope:
        """Receipt by id

        Args:
            id_: Value sent with the request.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(self._with_raw_response.get_receipt(id_, request_options=request_options))

    def list_receipts(
        self, *, limit: str | None = None, request_options: RequestOptionsOrDict | None = None
    ) -> list[ReceiptSummary]:
        """List receipts

        Args:
            limit: Default 100
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(self._with_raw_response.list_receipts(limit=limit, request_options=request_options))

    @property
    def with_raw_response(self) -> ReceiptsWithRawResponse:
        return self._with_raw_response


class AsyncReceipts:
    def __init__(self, client: AsyncRawClient, server: Server, auth: AsyncAuthSchemes) -> None:
        self._with_raw_response = AsyncReceiptsWithRawResponse(client, server, auth)

    async def get_payment_receipt(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ReceiptEnvelope:
        """Receipt for a payment

        Args:
            id_: Value sent with the request.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(await self._with_raw_response.get_payment_receipt(id_, request_options=request_options))

    async def get_public_receipt(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ReceiptEnvelope:
        """Public receipt lookup (only when AGENTGUARD_PUBLIC_RECEIPTS=1)

        Args:
            id_: Value sent with the request.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Not found Body over 256 KB Internal error ``error`` is ``ErrorResponse |
                RawError``."""
        return unwrap(await self._with_raw_response.get_public_receipt(id_, request_options=request_options))

    async def get_receipt(self, id_: str, *, request_options: RequestOptionsOrDict | None = None) -> ReceiptEnvelope:
        """Receipt by id

        Args:
            id_: Value sent with the request.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(await self._with_raw_response.get_receipt(id_, request_options=request_options))

    async def list_receipts(
        self, *, limit: str | None = None, request_options: RequestOptionsOrDict | None = None
    ) -> list[ReceiptSummary]:
        """List receipts

        Args:
            limit: Default 100
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(await self._with_raw_response.list_receipts(limit=limit, request_options=request_options))

    @property
    def with_raw_response(self) -> AsyncReceiptsWithRawResponse:
        return self._with_raw_response


class ReceiptsWithRawResponse(SecuredRawResponse[RawClient, Server, AuthSchemes]):
    def get_payment_receipt(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[ReceiptEnvelope, GetPaymentReceiptErrorBody]:
        """Receipt for a payment

        Args:
            id_: Value sent with the request.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="GET",
            url_template=self._server.default("/v1/payments/{id}/receipt"),
            path_params=[param[str]("id", id_)],
            auth_scheme=self._auth.admin,
            decoder=json_decoder[ReceiptEnvelope],
            error_mapper=get_payment_receipt_error_mapper,
            request_options=request_options,
        )

    def get_public_receipt(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[ReceiptEnvelope, GetPublicReceiptErrorBody]:
        """Public receipt lookup (only when AGENTGUARD_PUBLIC_RECEIPTS=1)

        Args:
            id_: Value sent with the request.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="GET",
            url_template=self._server.default("/v1/public/receipts/{id}"),
            path_params=[param[str]("id", id_)],
            decoder=json_decoder[ReceiptEnvelope],
            error_mapper=get_public_receipt_error_mapper,
            request_options=request_options,
        )

    def get_receipt(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[ReceiptEnvelope, GetReceiptErrorBody]:
        """Receipt by id

        Args:
            id_: Value sent with the request.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="GET",
            url_template=self._server.default("/v1/receipts/{id}"),
            path_params=[param[str]("id", id_)],
            auth_scheme=self._auth.admin,
            decoder=json_decoder[ReceiptEnvelope],
            error_mapper=get_receipt_error_mapper,
            request_options=request_options,
        )

    def list_receipts(
        self, *, limit: str | None = None, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[list[ReceiptSummary], ListReceiptsErrorBody]:
        """List receipts

        Args:
            limit: Default 100
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="GET",
            url_template=self._server.default("/v1/receipts"),
            query_params=[param[str | None]("limit", limit)],
            auth_scheme=self._auth.admin,
            decoder=json_decoder[list[ReceiptSummary]],
            error_mapper=list_receipts_error_mapper,
            request_options=request_options,
        )


class AsyncReceiptsWithRawResponse(SecuredRawResponse[AsyncRawClient, Server, AsyncAuthSchemes]):
    async def get_payment_receipt(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[ReceiptEnvelope, GetPaymentReceiptErrorBody]:
        """Receipt for a payment

        Args:
            id_: Value sent with the request.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="GET",
            url_template=self._server.default("/v1/payments/{id}/receipt"),
            path_params=[param[str]("id", id_)],
            auth_scheme=self._auth.admin,
            decoder=async_json_decoder[ReceiptEnvelope],
            error_mapper=get_payment_receipt_error_mapper,
            request_options=request_options,
        )

    async def get_public_receipt(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[ReceiptEnvelope, GetPublicReceiptErrorBody]:
        """Public receipt lookup (only when AGENTGUARD_PUBLIC_RECEIPTS=1)

        Args:
            id_: Value sent with the request.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="GET",
            url_template=self._server.default("/v1/public/receipts/{id}"),
            path_params=[param[str]("id", id_)],
            decoder=async_json_decoder[ReceiptEnvelope],
            error_mapper=get_public_receipt_error_mapper,
            request_options=request_options,
        )

    async def get_receipt(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[ReceiptEnvelope, GetReceiptErrorBody]:
        """Receipt by id

        Args:
            id_: Value sent with the request.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="GET",
            url_template=self._server.default("/v1/receipts/{id}"),
            path_params=[param[str]("id", id_)],
            auth_scheme=self._auth.admin,
            decoder=async_json_decoder[ReceiptEnvelope],
            error_mapper=get_receipt_error_mapper,
            request_options=request_options,
        )

    async def list_receipts(
        self, *, limit: str | None = None, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[list[ReceiptSummary], ListReceiptsErrorBody]:
        """List receipts

        Args:
            limit: Default 100
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="GET",
            url_template=self._server.default("/v1/receipts"),
            query_params=[param[str | None]("limit", limit)],
            auth_scheme=self._auth.admin,
            decoder=async_json_decoder[list[ReceiptSummary]],
            error_mapper=list_receipts_error_mapper,
            request_options=request_options,
        )
