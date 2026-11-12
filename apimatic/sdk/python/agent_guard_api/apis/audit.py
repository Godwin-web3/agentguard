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
    json_decoder,
    param,
    unwrap,
)
from ..errors.anchor_audit_chain_error import AnchorAuditChainErrorBody, anchor_audit_chain_error_mapper
from ..errors.get_audit_attestation_error import GetAuditAttestationErrorBody, get_audit_attestation_error_mapper
from ..errors.list_audit_anchors_error import ListAuditAnchorsErrorBody, list_audit_anchors_error_mapper
from ..errors.list_audit_entries_error import ListAuditEntriesErrorBody, list_audit_entries_error_mapper
from ..errors.verify_audit_chain_error import VerifyAuditChainErrorBody, verify_audit_chain_error_mapper
from ..models.audit_entry import AuditEntry
from ..models.audit_verification import AuditVerification
from ..server.server import Server


class Audit:
    def __init__(self, client: RawClient, server: Server, auth: AuthSchemes) -> None:
        self._with_raw_response = AuditWithRawResponse(client, server, auth)

    def anchor_audit_chain(self, *, request_options: RequestOptionsOrDict | None = None) -> Any:
        """Anchor the chain head now (RFC 6962 Merkle root, RFC 3161 stamped)

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(self._with_raw_response.anchor_audit_chain(request_options=request_options))

    def get_audit_attestation(self, *, request_options: RequestOptionsOrDict | None = None) -> Any:
        """Chain head signed with the active issuer key

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(self._with_raw_response.get_audit_attestation(request_options=request_options))

    def list_audit_anchors(
        self, *, limit: str | None = None, request_options: RequestOptionsOrDict | None = None
    ) -> Any:
        """Published anchors; keep copies to detect forks

        Args:
            limit: Default 100
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Not found Body over 256 KB Internal error ``error`` is ``ErrorResponse |
                RawError``."""
        return unwrap(self._with_raw_response.list_audit_anchors(limit=limit, request_options=request_options))

    def list_audit_entries(
        self, *, limit: str | None = None, request_options: RequestOptionsOrDict | None = None
    ) -> list[AuditEntry]:
        """Hash-chained audit log

        Args:
            limit: Default 200
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(self._with_raw_response.list_audit_entries(limit=limit, request_options=request_options))

    def verify_audit_chain(self, *, request_options: RequestOptionsOrDict | None = None) -> AuditVerification:
        """Recompute and verify the whole chain

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(self._with_raw_response.verify_audit_chain(request_options=request_options))

    @property
    def with_raw_response(self) -> AuditWithRawResponse:
        return self._with_raw_response


class AsyncAudit:
    def __init__(self, client: AsyncRawClient, server: Server, auth: AsyncAuthSchemes) -> None:
        self._with_raw_response = AsyncAuditWithRawResponse(client, server, auth)

    async def anchor_audit_chain(self, *, request_options: RequestOptionsOrDict | None = None) -> Any:
        """Anchor the chain head now (RFC 6962 Merkle root, RFC 3161 stamped)

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(await self._with_raw_response.anchor_audit_chain(request_options=request_options))

    async def get_audit_attestation(self, *, request_options: RequestOptionsOrDict | None = None) -> Any:
        """Chain head signed with the active issuer key

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(await self._with_raw_response.get_audit_attestation(request_options=request_options))

    async def list_audit_anchors(
        self, *, limit: str | None = None, request_options: RequestOptionsOrDict | None = None
    ) -> Any:
        """Published anchors; keep copies to detect forks

        Args:
            limit: Default 100
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Not found Body over 256 KB Internal error ``error`` is ``ErrorResponse |
                RawError``."""
        return unwrap(await self._with_raw_response.list_audit_anchors(limit=limit, request_options=request_options))

    async def list_audit_entries(
        self, *, limit: str | None = None, request_options: RequestOptionsOrDict | None = None
    ) -> list[AuditEntry]:
        """Hash-chained audit log

        Args:
            limit: Default 200
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(await self._with_raw_response.list_audit_entries(limit=limit, request_options=request_options))

    async def verify_audit_chain(self, *, request_options: RequestOptionsOrDict | None = None) -> AuditVerification:
        """Recompute and verify the whole chain

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(await self._with_raw_response.verify_audit_chain(request_options=request_options))

    @property
    def with_raw_response(self) -> AsyncAuditWithRawResponse:
        return self._with_raw_response


class AuditWithRawResponse(SecuredRawResponse[RawClient, Server, AuthSchemes]):
    def anchor_audit_chain(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[Any, AnchorAuditChainErrorBody]:
        """Anchor the chain head now (RFC 6962 Merkle root, RFC 3161 stamped)

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="POST",
            url_template=self._server.default("/v1/audit/anchor"),
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            auth_scheme=self._auth.admin,
            decoder=json_decoder[Any],
            error_mapper=anchor_audit_chain_error_mapper,
            request_options=request_options,
        )

    def get_audit_attestation(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[Any, GetAuditAttestationErrorBody]:
        """Chain head signed with the active issuer key

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="GET",
            url_template=self._server.default("/v1/audit/attestation"),
            auth_scheme=self._auth.admin,
            decoder=json_decoder[Any],
            error_mapper=get_audit_attestation_error_mapper,
            request_options=request_options,
        )

    def list_audit_anchors(
        self, *, limit: str | None = None, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[Any, ListAuditAnchorsErrorBody]:
        """Published anchors; keep copies to detect forks

        Args:
            limit: Default 100
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="GET",
            url_template=self._server.default("/v1/audit/anchors"),
            query_params=[param[str | None]("limit", limit)],
            decoder=json_decoder[Any],
            error_mapper=list_audit_anchors_error_mapper,
            request_options=request_options,
        )

    def list_audit_entries(
        self, *, limit: str | None = None, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[list[AuditEntry], ListAuditEntriesErrorBody]:
        """Hash-chained audit log

        Args:
            limit: Default 200
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="GET",
            url_template=self._server.default("/v1/audit"),
            query_params=[param[str | None]("limit", limit)],
            auth_scheme=self._auth.admin,
            decoder=json_decoder[list[AuditEntry]],
            error_mapper=list_audit_entries_error_mapper,
            request_options=request_options,
        )

    def verify_audit_chain(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[AuditVerification, VerifyAuditChainErrorBody]:
        """Recompute and verify the whole chain

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="GET",
            url_template=self._server.default("/v1/audit/verify"),
            auth_scheme=self._auth.admin,
            decoder=json_decoder[AuditVerification],
            error_mapper=verify_audit_chain_error_mapper,
            request_options=request_options,
        )


class AsyncAuditWithRawResponse(SecuredRawResponse[AsyncRawClient, Server, AsyncAuthSchemes]):
    async def anchor_audit_chain(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[Any, AnchorAuditChainErrorBody]:
        """Anchor the chain head now (RFC 6962 Merkle root, RFC 3161 stamped)

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="POST",
            url_template=self._server.default("/v1/audit/anchor"),
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            auth_scheme=self._auth.admin,
            decoder=async_json_decoder[Any],
            error_mapper=anchor_audit_chain_error_mapper,
            request_options=request_options,
        )

    async def get_audit_attestation(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[Any, GetAuditAttestationErrorBody]:
        """Chain head signed with the active issuer key

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="GET",
            url_template=self._server.default("/v1/audit/attestation"),
            auth_scheme=self._auth.admin,
            decoder=async_json_decoder[Any],
            error_mapper=get_audit_attestation_error_mapper,
            request_options=request_options,
        )

    async def list_audit_anchors(
        self, *, limit: str | None = None, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[Any, ListAuditAnchorsErrorBody]:
        """Published anchors; keep copies to detect forks

        Args:
            limit: Default 100
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="GET",
            url_template=self._server.default("/v1/audit/anchors"),
            query_params=[param[str | None]("limit", limit)],
            decoder=async_json_decoder[Any],
            error_mapper=list_audit_anchors_error_mapper,
            request_options=request_options,
        )

    async def list_audit_entries(
        self, *, limit: str | None = None, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[list[AuditEntry], ListAuditEntriesErrorBody]:
        """Hash-chained audit log

        Args:
            limit: Default 200
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="GET",
            url_template=self._server.default("/v1/audit"),
            query_params=[param[str | None]("limit", limit)],
            auth_scheme=self._auth.admin,
            decoder=async_json_decoder[list[AuditEntry]],
            error_mapper=list_audit_entries_error_mapper,
            request_options=request_options,
        )

    async def verify_audit_chain(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[AuditVerification, VerifyAuditChainErrorBody]:
        """Recompute and verify the whole chain

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="GET",
            url_template=self._server.default("/v1/audit/verify"),
            auth_scheme=self._auth.admin,
            decoder=async_json_decoder[AuditVerification],
            error_mapper=verify_audit_chain_error_mapper,
            request_options=request_options,
        )
