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
from ..errors.get_product_search_status_error import (
    GetProductSearchStatusErrorBody,
    get_product_search_status_error_mapper,
)
from ..errors.search_products_for_mandate_error import (
    SearchProductsForMandateErrorBody,
    search_products_for_mandate_error_mapper,
)
from ..models.product_search_result import ProductSearchResult
from ..models.v1_products_search_request import V1ProductsSearchRequest, V1ProductsSearchRequestDict
from ..server.server import Server


class Catalog:
    def __init__(self, client: RawClient, server: Server, auth: AuthSchemes) -> None:
        self._with_raw_response = CatalogWithRawResponse(client, server, auth)

    def get_product_search_status(self, *, request_options: RequestOptionsOrDict | None = None) -> Any:
        """Whether Channel3 product search is configured (CHANNEL3_API_KEY)

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(self._with_raw_response.get_product_search_status(request_options=request_options))

    def search_products_for_mandate(
        self,
        body: V1ProductsSearchRequest | V1ProductsSearchRequestDict,
        *,
        request_options: RequestOptionsOrDict | None = None,
    ) -> ProductSearchResult:
        """Owner view of the same Channel3 search, with an advisory mandate-fit check per product

        Args:
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(self._with_raw_response.search_products_for_mandate(body, request_options=request_options))

    @property
    def with_raw_response(self) -> CatalogWithRawResponse:
        return self._with_raw_response


class AsyncCatalog:
    def __init__(self, client: AsyncRawClient, server: Server, auth: AsyncAuthSchemes) -> None:
        self._with_raw_response = AsyncCatalogWithRawResponse(client, server, auth)

    async def get_product_search_status(self, *, request_options: RequestOptionsOrDict | None = None) -> Any:
        """Whether Channel3 product search is configured (CHANNEL3_API_KEY)

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(await self._with_raw_response.get_product_search_status(request_options=request_options))

    async def search_products_for_mandate(
        self,
        body: V1ProductsSearchRequest | V1ProductsSearchRequestDict,
        *,
        request_options: RequestOptionsOrDict | None = None,
    ) -> ProductSearchResult:
        """Owner view of the same Channel3 search, with an advisory mandate-fit check per product

        Args:
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(await self._with_raw_response.search_products_for_mandate(body, request_options=request_options))

    @property
    def with_raw_response(self) -> AsyncCatalogWithRawResponse:
        return self._with_raw_response


class CatalogWithRawResponse(SecuredRawResponse[RawClient, Server, AuthSchemes]):
    def get_product_search_status(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[Any, GetProductSearchStatusErrorBody]:
        """Whether Channel3 product search is configured (CHANNEL3_API_KEY)

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="GET",
            url_template=self._server.default("/v1/products/status"),
            auth_scheme=self._auth.admin,
            decoder=json_decoder[Any],
            error_mapper=get_product_search_status_error_mapper,
            request_options=request_options,
        )

    def search_products_for_mandate(
        self,
        body: V1ProductsSearchRequest | V1ProductsSearchRequestDict,
        *,
        request_options: RequestOptionsOrDict | None = None,
    ) -> ApiResult[ProductSearchResult, SearchProductsForMandateErrorBody]:
        """Owner view of the same Channel3 search, with an advisory mandate-fit check per product

        Args:
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="POST",
            url_template=self._server.default("/v1/products/search"),
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            body=json_body[V1ProductsSearchRequest | V1ProductsSearchRequestDict](body),
            auth_scheme=self._auth.admin,
            decoder=json_decoder[ProductSearchResult],
            error_mapper=search_products_for_mandate_error_mapper,
            request_options=request_options,
        )


class AsyncCatalogWithRawResponse(SecuredRawResponse[AsyncRawClient, Server, AsyncAuthSchemes]):
    async def get_product_search_status(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[Any, GetProductSearchStatusErrorBody]:
        """Whether Channel3 product search is configured (CHANNEL3_API_KEY)

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="GET",
            url_template=self._server.default("/v1/products/status"),
            auth_scheme=self._auth.admin,
            decoder=async_json_decoder[Any],
            error_mapper=get_product_search_status_error_mapper,
            request_options=request_options,
        )

    async def search_products_for_mandate(
        self,
        body: V1ProductsSearchRequest | V1ProductsSearchRequestDict,
        *,
        request_options: RequestOptionsOrDict | None = None,
    ) -> ApiResult[ProductSearchResult, SearchProductsForMandateErrorBody]:
        """Owner view of the same Channel3 search, with an advisory mandate-fit check per product

        Args:
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="POST",
            url_template=self._server.default("/v1/products/search"),
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            body=json_body[V1ProductsSearchRequest | V1ProductsSearchRequestDict](body),
            auth_scheme=self._auth.admin,
            decoder=async_json_decoder[ProductSearchResult],
            error_mapper=search_products_for_mandate_error_mapper,
            request_options=request_options,
        )
