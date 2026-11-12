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
from ..errors.get_approval_options_error import GetApprovalOptionsErrorBody, get_approval_options_error_mapper
from ..errors.list_approvals_error import ListApprovalsErrorBody, list_approvals_error_mapper
from ..errors.resolve_approval_error import ResolveApprovalErrorBody, resolve_approval_error_mapper
from ..models.v1_approvals_request import V1ApprovalsRequest, V1ApprovalsRequestDict
from ..models.v1_approvals_request_request import V1ApprovalsRequestRequest, V1ApprovalsRequestRequestDict
from ..server.server import Server


class Approvals:
    def __init__(self, client: RawClient, server: Server, auth: AuthSchemes) -> None:
        self._with_raw_response = ApprovalsWithRawResponse(client, server, auth)

    def get_approval_options(
        self,
        id_: str,
        body: V1ApprovalsRequestRequest | V1ApprovalsRequestRequestDict,
        *,
        request_options: RequestOptionsOrDict | None = None,
    ) -> Any:
        """Approval statement and WebAuthn options (5-minute nonce)

        Args:
            id_: Value sent with the request.
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(self._with_raw_response.get_approval_options(id_, body, request_options=request_options))

    def list_approvals(self, *, request_options: RequestOptionsOrDict | None = None) -> Any:
        """Payments held for the owner

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(self._with_raw_response.list_approvals(request_options=request_options))

    def resolve_approval(
        self,
        id_: str,
        body: V1ApprovalsRequest | V1ApprovalsRequestDict,
        *,
        request_options: RequestOptionsOrDict | None = None,
    ) -> Any:
        """Approve or deny with the user's passkey. The admin token alone is refused.

        Args:
            id_: Value sent with the request.
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(self._with_raw_response.resolve_approval(id_, body, request_options=request_options))

    @property
    def with_raw_response(self) -> ApprovalsWithRawResponse:
        return self._with_raw_response


class AsyncApprovals:
    def __init__(self, client: AsyncRawClient, server: Server, auth: AsyncAuthSchemes) -> None:
        self._with_raw_response = AsyncApprovalsWithRawResponse(client, server, auth)

    async def get_approval_options(
        self,
        id_: str,
        body: V1ApprovalsRequestRequest | V1ApprovalsRequestRequestDict,
        *,
        request_options: RequestOptionsOrDict | None = None,
    ) -> Any:
        """Approval statement and WebAuthn options (5-minute nonce)

        Args:
            id_: Value sent with the request.
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(await self._with_raw_response.get_approval_options(id_, body, request_options=request_options))

    async def list_approvals(self, *, request_options: RequestOptionsOrDict | None = None) -> Any:
        """Payments held for the owner

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(await self._with_raw_response.list_approvals(request_options=request_options))

    async def resolve_approval(
        self,
        id_: str,
        body: V1ApprovalsRequest | V1ApprovalsRequestDict,
        *,
        request_options: RequestOptionsOrDict | None = None,
    ) -> Any:
        """Approve or deny with the user's passkey. The admin token alone is refused.

        Args:
            id_: Value sent with the request.
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(await self._with_raw_response.resolve_approval(id_, body, request_options=request_options))

    @property
    def with_raw_response(self) -> AsyncApprovalsWithRawResponse:
        return self._with_raw_response


class ApprovalsWithRawResponse(SecuredRawResponse[RawClient, Server, AuthSchemes]):
    def get_approval_options(
        self,
        id_: str,
        body: V1ApprovalsRequestRequest | V1ApprovalsRequestRequestDict,
        *,
        request_options: RequestOptionsOrDict | None = None,
    ) -> ApiResult[Any, GetApprovalOptionsErrorBody]:
        """Approval statement and WebAuthn options (5-minute nonce)

        Args:
            id_: Value sent with the request.
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="POST",
            url_template=self._server.default("/v1/approvals/{id}/request"),
            path_params=[param[str]("id", id_)],
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            body=json_body[V1ApprovalsRequestRequest | V1ApprovalsRequestRequestDict](body),
            auth_scheme=self._auth.admin,
            decoder=json_decoder[Any],
            error_mapper=get_approval_options_error_mapper,
            request_options=request_options,
        )

    def list_approvals(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[Any, ListApprovalsErrorBody]:
        """Payments held for the owner

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="GET",
            url_template=self._server.default("/v1/approvals"),
            auth_scheme=self._auth.admin,
            decoder=json_decoder[Any],
            error_mapper=list_approvals_error_mapper,
            request_options=request_options,
        )

    def resolve_approval(
        self,
        id_: str,
        body: V1ApprovalsRequest | V1ApprovalsRequestDict,
        *,
        request_options: RequestOptionsOrDict | None = None,
    ) -> ApiResult[Any, ResolveApprovalErrorBody]:
        """Approve or deny with the user's passkey. The admin token alone is refused.

        Args:
            id_: Value sent with the request.
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="POST",
            url_template=self._server.default("/v1/approvals/{id}"),
            path_params=[param[str]("id", id_)],
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            body=json_body[V1ApprovalsRequest | V1ApprovalsRequestDict](body),
            auth_scheme=self._auth.admin,
            decoder=json_decoder[Any],
            error_mapper=resolve_approval_error_mapper,
            request_options=request_options,
        )


class AsyncApprovalsWithRawResponse(SecuredRawResponse[AsyncRawClient, Server, AsyncAuthSchemes]):
    async def get_approval_options(
        self,
        id_: str,
        body: V1ApprovalsRequestRequest | V1ApprovalsRequestRequestDict,
        *,
        request_options: RequestOptionsOrDict | None = None,
    ) -> ApiResult[Any, GetApprovalOptionsErrorBody]:
        """Approval statement and WebAuthn options (5-minute nonce)

        Args:
            id_: Value sent with the request.
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="POST",
            url_template=self._server.default("/v1/approvals/{id}/request"),
            path_params=[param[str]("id", id_)],
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            body=json_body[V1ApprovalsRequestRequest | V1ApprovalsRequestRequestDict](body),
            auth_scheme=self._auth.admin,
            decoder=async_json_decoder[Any],
            error_mapper=get_approval_options_error_mapper,
            request_options=request_options,
        )

    async def list_approvals(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[Any, ListApprovalsErrorBody]:
        """Payments held for the owner

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="GET",
            url_template=self._server.default("/v1/approvals"),
            auth_scheme=self._auth.admin,
            decoder=async_json_decoder[Any],
            error_mapper=list_approvals_error_mapper,
            request_options=request_options,
        )

    async def resolve_approval(
        self,
        id_: str,
        body: V1ApprovalsRequest | V1ApprovalsRequestDict,
        *,
        request_options: RequestOptionsOrDict | None = None,
    ) -> ApiResult[Any, ResolveApprovalErrorBody]:
        """Approve or deny with the user's passkey. The admin token alone is refused.

        Args:
            id_: Value sent with the request.
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="POST",
            url_template=self._server.default("/v1/approvals/{id}"),
            path_params=[param[str]("id", id_)],
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            body=json_body[V1ApprovalsRequest | V1ApprovalsRequestDict](body),
            auth_scheme=self._auth.admin,
            decoder=async_json_decoder[Any],
            error_mapper=resolve_approval_error_mapper,
            request_options=request_options,
        )
