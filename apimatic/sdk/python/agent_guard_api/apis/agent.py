from __future__ import annotations

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
from ..errors.get_agent_mandate_error import GetAgentMandateErrorBody, get_agent_mandate_error_mapper
from ..errors.get_agent_payment_error import GetAgentPaymentErrorBody, get_agent_payment_error_mapper
from ..errors.get_agent_payment_receipt_error import (
    GetAgentPaymentReceiptErrorBody,
    get_agent_payment_receipt_error_mapper,
)
from ..errors.propose_payment_error import ProposePaymentErrorBody, propose_payment_error_mapper
from ..errors.search_products_error import SearchProductsErrorBody, search_products_error_mapper
from ..models.agent_mandate import AgentMandate
from ..models.payment_decision import PaymentDecision
from ..models.product_search_result import ProductSearchResult
from ..models.receipt_envelope import ReceiptEnvelope
from ..models.v1_agent_payments_request import V1AgentPaymentsRequest, V1AgentPaymentsRequestDict
from ..models.v1_agent_products_search_request import V1AgentProductsSearchRequest, V1AgentProductsSearchRequestDict
from ..server.server import Server


class Agent:
    def __init__(self, client: RawClient, server: Server, auth: AuthSchemes) -> None:
        self._with_raw_response = AgentWithRawResponse(client, server, auth)

    def get_agent_mandate(self, id_: str, *, request_options: RequestOptionsOrDict | None = None) -> AgentMandate:
        """The agent's own mandate, status and spend

        Args:
            id_: Value sent with the request.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(self._with_raw_response.get_agent_mandate(id_, request_options=request_options))

    def get_agent_payment(self, id_: str, *, request_options: RequestOptionsOrDict | None = None) -> PaymentDecision:
        """Payment status (the calling agent's own only)

        Args:
            id_: Value sent with the request.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(self._with_raw_response.get_agent_payment(id_, request_options=request_options))

    def get_agent_payment_receipt(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ReceiptEnvelope:
        """Proof-of-Intent receipt for a captured payment

        Args:
            id_: Value sent with the request.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(self._with_raw_response.get_agent_payment_receipt(id_, request_options=request_options))

    def propose_payment(
        self,
        body: V1AgentPaymentsRequest | V1AgentPaymentsRequestDict,
        *,
        request_options: RequestOptionsOrDict | None = None,
    ) -> PaymentDecision:
        """Propose a payment (30/min per agent; 429 above)

        Args:
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Rate limited Internal error
                Paused by operator kill-switch ``error`` is ``ErrorResponse | RawError``."""
        return unwrap(self._with_raw_response.propose_payment(body, request_options=request_options))

    def search_products(
        self,
        body: V1AgentProductsSearchRequest | V1AgentProductsSearchRequestDict,
        *,
        request_options: RequestOptionsOrDict | None = None,
    ) -> ProductSearchResult:
        """Search the Channel3 product catalog within the mandate's currency and remaining budget (discovery only; never
        pays)

        Args:
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(self._with_raw_response.search_products(body, request_options=request_options))

    @property
    def with_raw_response(self) -> AgentWithRawResponse:
        return self._with_raw_response


class AsyncAgent:
    def __init__(self, client: AsyncRawClient, server: Server, auth: AsyncAuthSchemes) -> None:
        self._with_raw_response = AsyncAgentWithRawResponse(client, server, auth)

    async def get_agent_mandate(self, id_: str, *, request_options: RequestOptionsOrDict | None = None) -> AgentMandate:
        """The agent's own mandate, status and spend

        Args:
            id_: Value sent with the request.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(await self._with_raw_response.get_agent_mandate(id_, request_options=request_options))

    async def get_agent_payment(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> PaymentDecision:
        """Payment status (the calling agent's own only)

        Args:
            id_: Value sent with the request.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(await self._with_raw_response.get_agent_payment(id_, request_options=request_options))

    async def get_agent_payment_receipt(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ReceiptEnvelope:
        """Proof-of-Intent receipt for a captured payment

        Args:
            id_: Value sent with the request.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(await self._with_raw_response.get_agent_payment_receipt(id_, request_options=request_options))

    async def propose_payment(
        self,
        body: V1AgentPaymentsRequest | V1AgentPaymentsRequestDict,
        *,
        request_options: RequestOptionsOrDict | None = None,
    ) -> PaymentDecision:
        """Propose a payment (30/min per agent; 429 above)

        Args:
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Rate limited Internal error
                Paused by operator kill-switch ``error`` is ``ErrorResponse | RawError``."""
        return unwrap(await self._with_raw_response.propose_payment(body, request_options=request_options))

    async def search_products(
        self,
        body: V1AgentProductsSearchRequest | V1AgentProductsSearchRequestDict,
        *,
        request_options: RequestOptionsOrDict | None = None,
    ) -> ProductSearchResult:
        """Search the Channel3 product catalog within the mandate's currency and remaining budget (discovery only; never
        pays)

        Args:
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(await self._with_raw_response.search_products(body, request_options=request_options))

    @property
    def with_raw_response(self) -> AsyncAgentWithRawResponse:
        return self._with_raw_response


class AgentWithRawResponse(SecuredRawResponse[RawClient, Server, AuthSchemes]):
    def get_agent_mandate(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[AgentMandate, GetAgentMandateErrorBody]:
        """The agent's own mandate, status and spend

        Args:
            id_: Value sent with the request.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="GET",
            url_template=self._server.default("/v1/agent/mandates/{id}"),
            path_params=[param[str]("id", id_)],
            auth_scheme=self._auth.agent,
            decoder=json_decoder[AgentMandate],
            error_mapper=get_agent_mandate_error_mapper,
            request_options=request_options,
        )

    def get_agent_payment(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[PaymentDecision, GetAgentPaymentErrorBody]:
        """Payment status (the calling agent's own only)

        Args:
            id_: Value sent with the request.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="GET",
            url_template=self._server.default("/v1/agent/payments/{id}"),
            path_params=[param[str]("id", id_)],
            auth_scheme=self._auth.agent,
            decoder=json_decoder[PaymentDecision],
            error_mapper=get_agent_payment_error_mapper,
            request_options=request_options,
        )

    def get_agent_payment_receipt(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[ReceiptEnvelope, GetAgentPaymentReceiptErrorBody]:
        """Proof-of-Intent receipt for a captured payment

        Args:
            id_: Value sent with the request.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="GET",
            url_template=self._server.default("/v1/agent/payments/{id}/receipt"),
            path_params=[param[str]("id", id_)],
            auth_scheme=self._auth.agent,
            decoder=json_decoder[ReceiptEnvelope],
            error_mapper=get_agent_payment_receipt_error_mapper,
            request_options=request_options,
        )

    def propose_payment(
        self,
        body: V1AgentPaymentsRequest | V1AgentPaymentsRequestDict,
        *,
        request_options: RequestOptionsOrDict | None = None,
    ) -> ApiResult[PaymentDecision, ProposePaymentErrorBody]:
        """Propose a payment (30/min per agent; 429 above)

        Args:
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="POST",
            url_template=self._server.default("/v1/agent/payments"),
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            body=json_body[V1AgentPaymentsRequest | V1AgentPaymentsRequestDict](body),
            auth_scheme=self._auth.agent,
            decoder=json_decoder[PaymentDecision],
            error_mapper=propose_payment_error_mapper,
            request_options=request_options,
        )

    def search_products(
        self,
        body: V1AgentProductsSearchRequest | V1AgentProductsSearchRequestDict,
        *,
        request_options: RequestOptionsOrDict | None = None,
    ) -> ApiResult[ProductSearchResult, SearchProductsErrorBody]:
        """Search the Channel3 product catalog within the mandate's currency and remaining budget (discovery only; never
        pays)

        Args:
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="POST",
            url_template=self._server.default("/v1/agent/products/search"),
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            body=json_body[V1AgentProductsSearchRequest | V1AgentProductsSearchRequestDict](body),
            auth_scheme=self._auth.agent,
            decoder=json_decoder[ProductSearchResult],
            error_mapper=search_products_error_mapper,
            request_options=request_options,
        )


class AsyncAgentWithRawResponse(SecuredRawResponse[AsyncRawClient, Server, AsyncAuthSchemes]):
    async def get_agent_mandate(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[AgentMandate, GetAgentMandateErrorBody]:
        """The agent's own mandate, status and spend

        Args:
            id_: Value sent with the request.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="GET",
            url_template=self._server.default("/v1/agent/mandates/{id}"),
            path_params=[param[str]("id", id_)],
            auth_scheme=self._auth.agent,
            decoder=async_json_decoder[AgentMandate],
            error_mapper=get_agent_mandate_error_mapper,
            request_options=request_options,
        )

    async def get_agent_payment(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[PaymentDecision, GetAgentPaymentErrorBody]:
        """Payment status (the calling agent's own only)

        Args:
            id_: Value sent with the request.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="GET",
            url_template=self._server.default("/v1/agent/payments/{id}"),
            path_params=[param[str]("id", id_)],
            auth_scheme=self._auth.agent,
            decoder=async_json_decoder[PaymentDecision],
            error_mapper=get_agent_payment_error_mapper,
            request_options=request_options,
        )

    async def get_agent_payment_receipt(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[ReceiptEnvelope, GetAgentPaymentReceiptErrorBody]:
        """Proof-of-Intent receipt for a captured payment

        Args:
            id_: Value sent with the request.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="GET",
            url_template=self._server.default("/v1/agent/payments/{id}/receipt"),
            path_params=[param[str]("id", id_)],
            auth_scheme=self._auth.agent,
            decoder=async_json_decoder[ReceiptEnvelope],
            error_mapper=get_agent_payment_receipt_error_mapper,
            request_options=request_options,
        )

    async def propose_payment(
        self,
        body: V1AgentPaymentsRequest | V1AgentPaymentsRequestDict,
        *,
        request_options: RequestOptionsOrDict | None = None,
    ) -> ApiResult[PaymentDecision, ProposePaymentErrorBody]:
        """Propose a payment (30/min per agent; 429 above)

        Args:
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="POST",
            url_template=self._server.default("/v1/agent/payments"),
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            body=json_body[V1AgentPaymentsRequest | V1AgentPaymentsRequestDict](body),
            auth_scheme=self._auth.agent,
            decoder=async_json_decoder[PaymentDecision],
            error_mapper=propose_payment_error_mapper,
            request_options=request_options,
        )

    async def search_products(
        self,
        body: V1AgentProductsSearchRequest | V1AgentProductsSearchRequestDict,
        *,
        request_options: RequestOptionsOrDict | None = None,
    ) -> ApiResult[ProductSearchResult, SearchProductsErrorBody]:
        """Search the Channel3 product catalog within the mandate's currency and remaining budget (discovery only; never
        pays)

        Args:
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="POST",
            url_template=self._server.default("/v1/agent/products/search"),
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            body=json_body[V1AgentProductsSearchRequest | V1AgentProductsSearchRequestDict](body),
            auth_scheme=self._auth.agent,
            decoder=async_json_decoder[ProductSearchResult],
            error_mapper=search_products_error_mapper,
            request_options=request_options,
        )
