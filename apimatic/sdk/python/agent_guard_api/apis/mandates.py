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
from ..errors.confirm_mandate_error import ConfirmMandateErrorBody, confirm_mandate_error_mapper
from ..errors.create_mandate_error import CreateMandateErrorBody, create_mandate_error_mapper
from ..errors.draft_mandate_from_text_error import DraftMandateFromTextErrorBody, draft_mandate_from_text_error_mapper
from ..errors.get_mandate_error import GetMandateErrorBody, get_mandate_error_mapper
from ..errors.get_mandate_revocation_options_error import (
    GetMandateRevocationOptionsErrorBody,
    get_mandate_revocation_options_error_mapper,
)
from ..errors.get_mandate_signing_options_error import (
    GetMandateSigningOptionsErrorBody,
    get_mandate_signing_options_error_mapper,
)
from ..errors.list_mandates_error import ListMandatesErrorBody, list_mandates_error_mapper
from ..errors.revoke_mandate_error import RevokeMandateErrorBody, revoke_mandate_error_mapper
from ..models.v1_mandates_confirm_request import V1MandatesConfirmRequest, V1MandatesConfirmRequestDict
from ..models.v1_mandates_draft_from_text_request import (
    V1MandatesDraftFromTextRequest,
    V1MandatesDraftFromTextRequestDict,
)
from ..models.v1_mandates_request import V1MandatesRequest, V1MandatesRequestDict
from ..models.v1_mandates_revoke_request import V1MandatesRevokeRequest, V1MandatesRevokeRequestDict
from ..server.server import Server


class Mandates:
    def __init__(self, client: RawClient, server: Server, auth: AuthSchemes) -> None:
        self._with_raw_response = MandatesWithRawResponse(client, server, auth)

    def confirm_mandate(
        self,
        id_: str,
        body: V1MandatesConfirmRequest | V1MandatesConfirmRequestDict,
        *,
        request_options: RequestOptionsOrDict | None = None,
    ) -> Any:
        """Activate a mandate with the user's passkey assertion

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
        return unwrap(self._with_raw_response.confirm_mandate(id_, body, request_options=request_options))

    def create_mandate(
        self, body: V1MandatesRequest | V1MandatesRequestDict, *, request_options: RequestOptionsOrDict | None = None
    ) -> Any:
        """Create a draft mandate from structured constraints

        Args:
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(self._with_raw_response.create_mandate(body, request_options=request_options))

    def draft_mandate_from_text(
        self,
        body: V1MandatesDraftFromTextRequest | V1MandatesDraftFromTextRequestDict,
        *,
        request_options: RequestOptionsOrDict | None = None,
    ) -> Any:
        """Draft a mandate from plain English (model proposes, deterministic parser bounds it)

        Args:
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(self._with_raw_response.draft_mandate_from_text(body, request_options=request_options))

    def get_mandate(self, id_: str, *, request_options: RequestOptionsOrDict | None = None) -> Any:
        """Mandate, status and spend

        Args:
            id_: Value sent with the request.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(self._with_raw_response.get_mandate(id_, request_options=request_options))

    def get_mandate_revocation_options(self, id_: str, *, request_options: RequestOptionsOrDict | None = None) -> Any:
        """Get WebAuthn options for revocation

        Args:
            id_: Value sent with the request.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(self._with_raw_response.get_mandate_revocation_options(id_, request_options=request_options))

    def get_mandate_signing_options(self, id_: str, *, request_options: RequestOptionsOrDict | None = None) -> Any:
        """Get WebAuthn options whose challenge is the mandate hash

        Args:
            id_: Value sent with the request.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(self._with_raw_response.get_mandate_signing_options(id_, request_options=request_options))

    def list_mandates(self, *, request_options: RequestOptionsOrDict | None = None) -> Any:
        """List mandates with spend state and summary

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(self._with_raw_response.list_mandates(request_options=request_options))

    def revoke_mandate(
        self,
        id_: str,
        *,
        body: V1MandatesRevokeRequest | V1MandatesRevokeRequestDict | None = None,
        request_options: RequestOptionsOrDict | None = None,
    ) -> Any:
        """Revoke with the user's passkey (drafts can be discarded without one)

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
        return unwrap(self._with_raw_response.revoke_mandate(id_, body=body, request_options=request_options))

    @property
    def with_raw_response(self) -> MandatesWithRawResponse:
        return self._with_raw_response


class AsyncMandates:
    def __init__(self, client: AsyncRawClient, server: Server, auth: AsyncAuthSchemes) -> None:
        self._with_raw_response = AsyncMandatesWithRawResponse(client, server, auth)

    async def confirm_mandate(
        self,
        id_: str,
        body: V1MandatesConfirmRequest | V1MandatesConfirmRequestDict,
        *,
        request_options: RequestOptionsOrDict | None = None,
    ) -> Any:
        """Activate a mandate with the user's passkey assertion

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
        return unwrap(await self._with_raw_response.confirm_mandate(id_, body, request_options=request_options))

    async def create_mandate(
        self, body: V1MandatesRequest | V1MandatesRequestDict, *, request_options: RequestOptionsOrDict | None = None
    ) -> Any:
        """Create a draft mandate from structured constraints

        Args:
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(await self._with_raw_response.create_mandate(body, request_options=request_options))

    async def draft_mandate_from_text(
        self,
        body: V1MandatesDraftFromTextRequest | V1MandatesDraftFromTextRequestDict,
        *,
        request_options: RequestOptionsOrDict | None = None,
    ) -> Any:
        """Draft a mandate from plain English (model proposes, deterministic parser bounds it)

        Args:
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(await self._with_raw_response.draft_mandate_from_text(body, request_options=request_options))

    async def get_mandate(self, id_: str, *, request_options: RequestOptionsOrDict | None = None) -> Any:
        """Mandate, status and spend

        Args:
            id_: Value sent with the request.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(await self._with_raw_response.get_mandate(id_, request_options=request_options))

    async def get_mandate_revocation_options(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> Any:
        """Get WebAuthn options for revocation

        Args:
            id_: Value sent with the request.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(
            await self._with_raw_response.get_mandate_revocation_options(id_, request_options=request_options)
        )

    async def get_mandate_signing_options(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> Any:
        """Get WebAuthn options whose challenge is the mandate hash

        Args:
            id_: Value sent with the request.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(await self._with_raw_response.get_mandate_signing_options(id_, request_options=request_options))

    async def list_mandates(self, *, request_options: RequestOptionsOrDict | None = None) -> Any:
        """List mandates with spend state and summary

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(await self._with_raw_response.list_mandates(request_options=request_options))

    async def revoke_mandate(
        self,
        id_: str,
        *,
        body: V1MandatesRevokeRequest | V1MandatesRevokeRequestDict | None = None,
        request_options: RequestOptionsOrDict | None = None,
    ) -> Any:
        """Revoke with the user's passkey (drafts can be discarded without one)

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
        return unwrap(await self._with_raw_response.revoke_mandate(id_, body=body, request_options=request_options))

    @property
    def with_raw_response(self) -> AsyncMandatesWithRawResponse:
        return self._with_raw_response


class MandatesWithRawResponse(SecuredRawResponse[RawClient, Server, AuthSchemes]):
    def confirm_mandate(
        self,
        id_: str,
        body: V1MandatesConfirmRequest | V1MandatesConfirmRequestDict,
        *,
        request_options: RequestOptionsOrDict | None = None,
    ) -> ApiResult[Any, ConfirmMandateErrorBody]:
        """Activate a mandate with the user's passkey assertion

        Args:
            id_: Value sent with the request.
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="POST",
            url_template=self._server.default("/v1/mandates/{id}/confirm"),
            path_params=[param[str]("id", id_)],
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            body=json_body[V1MandatesConfirmRequest | V1MandatesConfirmRequestDict](body),
            auth_scheme=self._auth.admin,
            decoder=json_decoder[Any],
            error_mapper=confirm_mandate_error_mapper,
            request_options=request_options,
        )

    def create_mandate(
        self, body: V1MandatesRequest | V1MandatesRequestDict, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[Any, CreateMandateErrorBody]:
        """Create a draft mandate from structured constraints

        Args:
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="POST",
            url_template=self._server.default("/v1/mandates"),
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            body=json_body[V1MandatesRequest | V1MandatesRequestDict](body),
            auth_scheme=self._auth.admin,
            decoder=json_decoder[Any],
            error_mapper=create_mandate_error_mapper,
            request_options=request_options,
        )

    def draft_mandate_from_text(
        self,
        body: V1MandatesDraftFromTextRequest | V1MandatesDraftFromTextRequestDict,
        *,
        request_options: RequestOptionsOrDict | None = None,
    ) -> ApiResult[Any, DraftMandateFromTextErrorBody]:
        """Draft a mandate from plain English (model proposes, deterministic parser bounds it)

        Args:
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="POST",
            url_template=self._server.default("/v1/mandates/draft-from-text"),
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            body=json_body[V1MandatesDraftFromTextRequest | V1MandatesDraftFromTextRequestDict](body),
            auth_scheme=self._auth.admin,
            decoder=json_decoder[Any],
            error_mapper=draft_mandate_from_text_error_mapper,
            request_options=request_options,
        )

    def get_mandate(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[Any, GetMandateErrorBody]:
        """Mandate, status and spend

        Args:
            id_: Value sent with the request.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="GET",
            url_template=self._server.default("/v1/mandates/{id}"),
            path_params=[param[str]("id", id_)],
            auth_scheme=self._auth.admin,
            decoder=json_decoder[Any],
            error_mapper=get_mandate_error_mapper,
            request_options=request_options,
        )

    def get_mandate_revocation_options(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[Any, GetMandateRevocationOptionsErrorBody]:
        """Get WebAuthn options for revocation

        Args:
            id_: Value sent with the request.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="POST",
            url_template=self._server.default("/v1/mandates/{id}/revoke-request"),
            path_params=[param[str]("id", id_)],
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            auth_scheme=self._auth.admin,
            decoder=json_decoder[Any],
            error_mapper=get_mandate_revocation_options_error_mapper,
            request_options=request_options,
        )

    def get_mandate_signing_options(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[Any, GetMandateSigningOptionsErrorBody]:
        """Get WebAuthn options whose challenge is the mandate hash

        Args:
            id_: Value sent with the request.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="POST",
            url_template=self._server.default("/v1/mandates/{id}/sign-request"),
            path_params=[param[str]("id", id_)],
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            auth_scheme=self._auth.admin,
            decoder=json_decoder[Any],
            error_mapper=get_mandate_signing_options_error_mapper,
            request_options=request_options,
        )

    def list_mandates(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[Any, ListMandatesErrorBody]:
        """List mandates with spend state and summary

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="GET",
            url_template=self._server.default("/v1/mandates"),
            auth_scheme=self._auth.admin,
            decoder=json_decoder[Any],
            error_mapper=list_mandates_error_mapper,
            request_options=request_options,
        )

    def revoke_mandate(
        self,
        id_: str,
        *,
        body: V1MandatesRevokeRequest | V1MandatesRevokeRequestDict | None = None,
        request_options: RequestOptionsOrDict | None = None,
    ) -> ApiResult[Any, RevokeMandateErrorBody]:
        """Revoke with the user's passkey (drafts can be discarded without one)

        Args:
            id_: Value sent with the request.
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="POST",
            url_template=self._server.default("/v1/mandates/{id}/revoke"),
            path_params=[param[str]("id", id_)],
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            body=json_body[V1MandatesRevokeRequest | V1MandatesRevokeRequestDict | None](body),
            auth_scheme=self._auth.admin,
            decoder=json_decoder[Any],
            error_mapper=revoke_mandate_error_mapper,
            request_options=request_options,
        )


class AsyncMandatesWithRawResponse(SecuredRawResponse[AsyncRawClient, Server, AsyncAuthSchemes]):
    async def confirm_mandate(
        self,
        id_: str,
        body: V1MandatesConfirmRequest | V1MandatesConfirmRequestDict,
        *,
        request_options: RequestOptionsOrDict | None = None,
    ) -> ApiResult[Any, ConfirmMandateErrorBody]:
        """Activate a mandate with the user's passkey assertion

        Args:
            id_: Value sent with the request.
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="POST",
            url_template=self._server.default("/v1/mandates/{id}/confirm"),
            path_params=[param[str]("id", id_)],
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            body=json_body[V1MandatesConfirmRequest | V1MandatesConfirmRequestDict](body),
            auth_scheme=self._auth.admin,
            decoder=async_json_decoder[Any],
            error_mapper=confirm_mandate_error_mapper,
            request_options=request_options,
        )

    async def create_mandate(
        self, body: V1MandatesRequest | V1MandatesRequestDict, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[Any, CreateMandateErrorBody]:
        """Create a draft mandate from structured constraints

        Args:
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="POST",
            url_template=self._server.default("/v1/mandates"),
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            body=json_body[V1MandatesRequest | V1MandatesRequestDict](body),
            auth_scheme=self._auth.admin,
            decoder=async_json_decoder[Any],
            error_mapper=create_mandate_error_mapper,
            request_options=request_options,
        )

    async def draft_mandate_from_text(
        self,
        body: V1MandatesDraftFromTextRequest | V1MandatesDraftFromTextRequestDict,
        *,
        request_options: RequestOptionsOrDict | None = None,
    ) -> ApiResult[Any, DraftMandateFromTextErrorBody]:
        """Draft a mandate from plain English (model proposes, deterministic parser bounds it)

        Args:
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="POST",
            url_template=self._server.default("/v1/mandates/draft-from-text"),
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            body=json_body[V1MandatesDraftFromTextRequest | V1MandatesDraftFromTextRequestDict](body),
            auth_scheme=self._auth.admin,
            decoder=async_json_decoder[Any],
            error_mapper=draft_mandate_from_text_error_mapper,
            request_options=request_options,
        )

    async def get_mandate(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[Any, GetMandateErrorBody]:
        """Mandate, status and spend

        Args:
            id_: Value sent with the request.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="GET",
            url_template=self._server.default("/v1/mandates/{id}"),
            path_params=[param[str]("id", id_)],
            auth_scheme=self._auth.admin,
            decoder=async_json_decoder[Any],
            error_mapper=get_mandate_error_mapper,
            request_options=request_options,
        )

    async def get_mandate_revocation_options(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[Any, GetMandateRevocationOptionsErrorBody]:
        """Get WebAuthn options for revocation

        Args:
            id_: Value sent with the request.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="POST",
            url_template=self._server.default("/v1/mandates/{id}/revoke-request"),
            path_params=[param[str]("id", id_)],
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            auth_scheme=self._auth.admin,
            decoder=async_json_decoder[Any],
            error_mapper=get_mandate_revocation_options_error_mapper,
            request_options=request_options,
        )

    async def get_mandate_signing_options(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[Any, GetMandateSigningOptionsErrorBody]:
        """Get WebAuthn options whose challenge is the mandate hash

        Args:
            id_: Value sent with the request.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="POST",
            url_template=self._server.default("/v1/mandates/{id}/sign-request"),
            path_params=[param[str]("id", id_)],
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            auth_scheme=self._auth.admin,
            decoder=async_json_decoder[Any],
            error_mapper=get_mandate_signing_options_error_mapper,
            request_options=request_options,
        )

    async def list_mandates(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[Any, ListMandatesErrorBody]:
        """List mandates with spend state and summary

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="GET",
            url_template=self._server.default("/v1/mandates"),
            auth_scheme=self._auth.admin,
            decoder=async_json_decoder[Any],
            error_mapper=list_mandates_error_mapper,
            request_options=request_options,
        )

    async def revoke_mandate(
        self,
        id_: str,
        *,
        body: V1MandatesRevokeRequest | V1MandatesRevokeRequestDict | None = None,
        request_options: RequestOptionsOrDict | None = None,
    ) -> ApiResult[Any, RevokeMandateErrorBody]:
        """Revoke with the user's passkey (drafts can be discarded without one)

        Args:
            id_: Value sent with the request.
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="POST",
            url_template=self._server.default("/v1/mandates/{id}/revoke"),
            path_params=[param[str]("id", id_)],
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            body=json_body[V1MandatesRevokeRequest | V1MandatesRevokeRequestDict | None](body),
            auth_scheme=self._auth.admin,
            decoder=async_json_decoder[Any],
            error_mapper=revoke_mandate_error_mapper,
            request_options=request_options,
        )
