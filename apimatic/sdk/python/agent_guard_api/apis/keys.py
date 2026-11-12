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
from ..errors.get_issuer_key_error import GetIssuerKeyErrorBody, get_issuer_key_error_mapper
from ..errors.get_issuer_key_set_error import GetIssuerKeySetErrorBody, get_issuer_key_set_error_mapper
from ..errors.mark_key_compromised_error import MarkKeyCompromisedErrorBody, mark_key_compromised_error_mapper
from ..errors.rotate_issuer_key_error import RotateIssuerKeyErrorBody, rotate_issuer_key_error_mapper
from ..models.issuer_key_set import IssuerKeySet
from ..models.v1_keys_compromised_request import V1KeysCompromisedRequest, V1KeysCompromisedRequestDict
from ..server.server import Server


class Keys:
    def __init__(self, client: RawClient, server: Server, auth: AuthSchemes) -> None:
        self._with_raw_response = KeysWithRawResponse(client, server, auth)

    def get_issuer_key(self, *, request_options: RequestOptionsOrDict | None = None) -> Any:
        """Active issuer public key (legacy single-key form)

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Not found Body over 256 KB Internal error ``error`` is ``ErrorResponse |
                RawError``."""
        return unwrap(self._with_raw_response.get_issuer_key(request_options=request_options))

    def get_issuer_key_set(self, *, request_options: RequestOptionsOrDict | None = None) -> IssuerKeySet:
        """Issuer key set: every key with kid, status, created_at, retired_at, compromised_at. Pin this.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Not found Body over 256 KB Internal error ``error`` is ``ErrorResponse |
                RawError``."""
        return unwrap(self._with_raw_response.get_issuer_key_set(request_options=request_options))

    def mark_key_compromised(
        self,
        kid: str,
        *,
        body: V1KeysCompromisedRequest | V1KeysCompromisedRequestDict | None = None,
        request_options: RequestOptionsOrDict | None = None,
    ) -> Any:
        """Mark a key compromised as of ``at`` (rotates first if active)

        Args:
            kid: Value sent with the request.
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(self._with_raw_response.mark_key_compromised(kid, body=body, request_options=request_options))

    def rotate_issuer_key(self, *, request_options: RequestOptionsOrDict | None = None) -> Any:
        """Retire the active issuer key and create a new one (audited)

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(self._with_raw_response.rotate_issuer_key(request_options=request_options))

    @property
    def with_raw_response(self) -> KeysWithRawResponse:
        return self._with_raw_response


class AsyncKeys:
    def __init__(self, client: AsyncRawClient, server: Server, auth: AsyncAuthSchemes) -> None:
        self._with_raw_response = AsyncKeysWithRawResponse(client, server, auth)

    async def get_issuer_key(self, *, request_options: RequestOptionsOrDict | None = None) -> Any:
        """Active issuer public key (legacy single-key form)

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Not found Body over 256 KB Internal error ``error`` is ``ErrorResponse |
                RawError``."""
        return unwrap(await self._with_raw_response.get_issuer_key(request_options=request_options))

    async def get_issuer_key_set(self, *, request_options: RequestOptionsOrDict | None = None) -> IssuerKeySet:
        """Issuer key set: every key with kid, status, created_at, retired_at, compromised_at. Pin this.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Not found Body over 256 KB Internal error ``error`` is ``ErrorResponse |
                RawError``."""
        return unwrap(await self._with_raw_response.get_issuer_key_set(request_options=request_options))

    async def mark_key_compromised(
        self,
        kid: str,
        *,
        body: V1KeysCompromisedRequest | V1KeysCompromisedRequestDict | None = None,
        request_options: RequestOptionsOrDict | None = None,
    ) -> Any:
        """Mark a key compromised as of ``at`` (rotates first if active)

        Args:
            kid: Value sent with the request.
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(
            await self._with_raw_response.mark_key_compromised(kid, body=body, request_options=request_options)
        )

    async def rotate_issuer_key(self, *, request_options: RequestOptionsOrDict | None = None) -> Any:
        """Retire the active issuer key and create a new one (audited)

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(await self._with_raw_response.rotate_issuer_key(request_options=request_options))

    @property
    def with_raw_response(self) -> AsyncKeysWithRawResponse:
        return self._with_raw_response


class KeysWithRawResponse(SecuredRawResponse[RawClient, Server, AuthSchemes]):
    def get_issuer_key(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[Any, GetIssuerKeyErrorBody]:
        """Active issuer public key (legacy single-key form)

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="GET",
            url_template=self._server.default("/.well-known/agentguard-key"),
            decoder=json_decoder[Any],
            error_mapper=get_issuer_key_error_mapper,
            request_options=request_options,
        )

    def get_issuer_key_set(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[IssuerKeySet, GetIssuerKeySetErrorBody]:
        """Issuer key set: every key with kid, status, created_at, retired_at, compromised_at. Pin this.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="GET",
            url_template=self._server.default("/.well-known/agentguard-keys"),
            decoder=json_decoder[IssuerKeySet],
            error_mapper=get_issuer_key_set_error_mapper,
            request_options=request_options,
        )

    def mark_key_compromised(
        self,
        kid: str,
        *,
        body: V1KeysCompromisedRequest | V1KeysCompromisedRequestDict | None = None,
        request_options: RequestOptionsOrDict | None = None,
    ) -> ApiResult[Any, MarkKeyCompromisedErrorBody]:
        """Mark a key compromised as of ``at`` (rotates first if active)

        Args:
            kid: Value sent with the request.
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="POST",
            url_template=self._server.default("/v1/keys/{kid}/compromised"),
            path_params=[param[str]("kid", kid)],
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            body=json_body[V1KeysCompromisedRequest | V1KeysCompromisedRequestDict | None](body),
            auth_scheme=self._auth.admin,
            decoder=json_decoder[Any],
            error_mapper=mark_key_compromised_error_mapper,
            request_options=request_options,
        )

    def rotate_issuer_key(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[Any, RotateIssuerKeyErrorBody]:
        """Retire the active issuer key and create a new one (audited)

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="POST",
            url_template=self._server.default("/v1/keys/rotate"),
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            auth_scheme=self._auth.admin,
            decoder=json_decoder[Any],
            error_mapper=rotate_issuer_key_error_mapper,
            request_options=request_options,
        )


class AsyncKeysWithRawResponse(SecuredRawResponse[AsyncRawClient, Server, AsyncAuthSchemes]):
    async def get_issuer_key(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[Any, GetIssuerKeyErrorBody]:
        """Active issuer public key (legacy single-key form)

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="GET",
            url_template=self._server.default("/.well-known/agentguard-key"),
            decoder=async_json_decoder[Any],
            error_mapper=get_issuer_key_error_mapper,
            request_options=request_options,
        )

    async def get_issuer_key_set(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[IssuerKeySet, GetIssuerKeySetErrorBody]:
        """Issuer key set: every key with kid, status, created_at, retired_at, compromised_at. Pin this.

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="GET",
            url_template=self._server.default("/.well-known/agentguard-keys"),
            decoder=async_json_decoder[IssuerKeySet],
            error_mapper=get_issuer_key_set_error_mapper,
            request_options=request_options,
        )

    async def mark_key_compromised(
        self,
        kid: str,
        *,
        body: V1KeysCompromisedRequest | V1KeysCompromisedRequestDict | None = None,
        request_options: RequestOptionsOrDict | None = None,
    ) -> ApiResult[Any, MarkKeyCompromisedErrorBody]:
        """Mark a key compromised as of ``at`` (rotates first if active)

        Args:
            kid: Value sent with the request.
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="POST",
            url_template=self._server.default("/v1/keys/{kid}/compromised"),
            path_params=[param[str]("kid", kid)],
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            body=json_body[V1KeysCompromisedRequest | V1KeysCompromisedRequestDict | None](body),
            auth_scheme=self._auth.admin,
            decoder=async_json_decoder[Any],
            error_mapper=mark_key_compromised_error_mapper,
            request_options=request_options,
        )

    async def rotate_issuer_key(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[Any, RotateIssuerKeyErrorBody]:
        """Retire the active issuer key and create a new one (audited)

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="POST",
            url_template=self._server.default("/v1/keys/rotate"),
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            auth_scheme=self._auth.admin,
            decoder=async_json_decoder[Any],
            error_mapper=rotate_issuer_key_error_mapper,
            request_options=request_options,
        )
