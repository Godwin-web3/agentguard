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
from ..errors.run_anchor_job_error import RunAnchorJobErrorBody, run_anchor_job_error_mapper
from ..errors.run_anchor_job_post_error import RunAnchorJobPostErrorBody, run_anchor_job_post_error_mapper
from ..errors.run_maintenance_job_error import RunMaintenanceJobErrorBody, run_maintenance_job_error_mapper
from ..errors.run_maintenance_job_post_error import (
    RunMaintenanceJobPostErrorBody,
    run_maintenance_job_post_error_mapper,
)
from ..server.server import Server


class Jobs:
    def __init__(self, client: RawClient, server: Server, auth: AuthSchemes) -> None:
        self._with_raw_response = JobsWithRawResponse(client, server, auth)

    def run_anchor_job(self, *, request_options: RequestOptionsOrDict | None = None) -> Any:
        """Timestamp pending receipts and anchor the audit head (Bearer CRON_SECRET)

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(self._with_raw_response.run_anchor_job(request_options=request_options))

    def run_anchor_job_post(self, *, request_options: RequestOptionsOrDict | None = None) -> Any:
        """Same as GET, for pg_net callers

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(self._with_raw_response.run_anchor_job_post(request_options=request_options))

    def run_maintenance_job(self, *, request_options: RequestOptionsOrDict | None = None) -> Any:
        """Expire recovery locks, retry notifications, converge stuck payments

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(self._with_raw_response.run_maintenance_job(request_options=request_options))

    def run_maintenance_job_post(self, *, request_options: RequestOptionsOrDict | None = None) -> Any:
        """Same as GET, for pg_net callers

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(self._with_raw_response.run_maintenance_job_post(request_options=request_options))

    @property
    def with_raw_response(self) -> JobsWithRawResponse:
        return self._with_raw_response


class AsyncJobs:
    def __init__(self, client: AsyncRawClient, server: Server, auth: AsyncAuthSchemes) -> None:
        self._with_raw_response = AsyncJobsWithRawResponse(client, server, auth)

    async def run_anchor_job(self, *, request_options: RequestOptionsOrDict | None = None) -> Any:
        """Timestamp pending receipts and anchor the audit head (Bearer CRON_SECRET)

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(await self._with_raw_response.run_anchor_job(request_options=request_options))

    async def run_anchor_job_post(self, *, request_options: RequestOptionsOrDict | None = None) -> Any:
        """Same as GET, for pg_net callers

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(await self._with_raw_response.run_anchor_job_post(request_options=request_options))

    async def run_maintenance_job(self, *, request_options: RequestOptionsOrDict | None = None) -> Any:
        """Expire recovery locks, retry notifications, converge stuck payments

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(await self._with_raw_response.run_maintenance_job(request_options=request_options))

    async def run_maintenance_job_post(self, *, request_options: RequestOptionsOrDict | None = None) -> Any:
        """Same as GET, for pg_net callers

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(await self._with_raw_response.run_maintenance_job_post(request_options=request_options))

    @property
    def with_raw_response(self) -> AsyncJobsWithRawResponse:
        return self._with_raw_response


class JobsWithRawResponse(SecuredRawResponse[RawClient, Server, AuthSchemes]):
    def run_anchor_job(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[Any, RunAnchorJobErrorBody]:
        """Timestamp pending receipts and anchor the audit head (Bearer CRON_SECRET)

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="GET",
            url_template=self._server.default("/api/cron/anchor"),
            auth_scheme=self._auth.cron,
            decoder=json_decoder[Any],
            error_mapper=run_anchor_job_error_mapper,
            request_options=request_options,
        )

    def run_anchor_job_post(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[Any, RunAnchorJobPostErrorBody]:
        """Same as GET, for pg_net callers

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="POST",
            url_template=self._server.default("/api/cron/anchor"),
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            auth_scheme=self._auth.cron,
            decoder=json_decoder[Any],
            error_mapper=run_anchor_job_post_error_mapper,
            request_options=request_options,
        )

    def run_maintenance_job(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[Any, RunMaintenanceJobErrorBody]:
        """Expire recovery locks, retry notifications, converge stuck payments

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="GET",
            url_template=self._server.default("/api/cron/maintenance"),
            auth_scheme=self._auth.cron,
            decoder=json_decoder[Any],
            error_mapper=run_maintenance_job_error_mapper,
            request_options=request_options,
        )

    def run_maintenance_job_post(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[Any, RunMaintenanceJobPostErrorBody]:
        """Same as GET, for pg_net callers

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="POST",
            url_template=self._server.default("/api/cron/maintenance"),
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            auth_scheme=self._auth.cron,
            decoder=json_decoder[Any],
            error_mapper=run_maintenance_job_post_error_mapper,
            request_options=request_options,
        )


class AsyncJobsWithRawResponse(SecuredRawResponse[AsyncRawClient, Server, AsyncAuthSchemes]):
    async def run_anchor_job(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[Any, RunAnchorJobErrorBody]:
        """Timestamp pending receipts and anchor the audit head (Bearer CRON_SECRET)

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="GET",
            url_template=self._server.default("/api/cron/anchor"),
            auth_scheme=self._auth.cron,
            decoder=async_json_decoder[Any],
            error_mapper=run_anchor_job_error_mapper,
            request_options=request_options,
        )

    async def run_anchor_job_post(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[Any, RunAnchorJobPostErrorBody]:
        """Same as GET, for pg_net callers

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="POST",
            url_template=self._server.default("/api/cron/anchor"),
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            auth_scheme=self._auth.cron,
            decoder=async_json_decoder[Any],
            error_mapper=run_anchor_job_post_error_mapper,
            request_options=request_options,
        )

    async def run_maintenance_job(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[Any, RunMaintenanceJobErrorBody]:
        """Expire recovery locks, retry notifications, converge stuck payments

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="GET",
            url_template=self._server.default("/api/cron/maintenance"),
            auth_scheme=self._auth.cron,
            decoder=async_json_decoder[Any],
            error_mapper=run_maintenance_job_error_mapper,
            request_options=request_options,
        )

    async def run_maintenance_job_post(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[Any, RunMaintenanceJobPostErrorBody]:
        """Same as GET, for pg_net callers

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="POST",
            url_template=self._server.default("/api/cron/maintenance"),
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            auth_scheme=self._auth.cron,
            decoder=async_json_decoder[Any],
            error_mapper=run_maintenance_job_post_error_mapper,
            request_options=request_options,
        )
