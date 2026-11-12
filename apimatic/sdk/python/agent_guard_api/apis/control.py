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
from ..errors.get_pause_state_error import GetPauseStateErrorBody, get_pause_state_error_mapper
from ..errors.pause_error import PauseErrorBody, pause_error_mapper
from ..errors.resume_error import ResumeErrorBody, resume_error_mapper
from ..models.pause_state import PauseState
from ..models.v1_control_pause_request import V1ControlPauseRequest, V1ControlPauseRequestDict
from ..models.v1_control_resume_request import V1ControlResumeRequest, V1ControlResumeRequestDict
from ..server.server import Server


class Control:
    def __init__(self, client: RawClient, server: Server, auth: AuthSchemes) -> None:
        self._with_raw_response = ControlWithRawResponse(client, server, auth)

    def get_pause_state(self, *, request_options: RequestOptionsOrDict | None = None) -> PauseState:
        """Kill-switch state

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(self._with_raw_response.get_pause_state(request_options=request_options))

    def pause(
        self,
        *,
        body: V1ControlPauseRequest | V1ControlPauseRequestDict | None = None,
        request_options: RequestOptionsOrDict | None = None,
    ) -> Any:
        """Block every new proposal and approval (503)

        Args:
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(self._with_raw_response.pause(body=body, request_options=request_options))

    def resume(
        self,
        *,
        body: V1ControlResumeRequest | V1ControlResumeRequestDict | None = None,
        request_options: RequestOptionsOrDict | None = None,
    ) -> Any:
        """Lift the kill-switch

        Args:
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(self._with_raw_response.resume(body=body, request_options=request_options))

    @property
    def with_raw_response(self) -> ControlWithRawResponse:
        return self._with_raw_response


class AsyncControl:
    def __init__(self, client: AsyncRawClient, server: Server, auth: AsyncAuthSchemes) -> None:
        self._with_raw_response = AsyncControlWithRawResponse(client, server, auth)

    async def get_pause_state(self, *, request_options: RequestOptionsOrDict | None = None) -> PauseState:
        """Kill-switch state

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(await self._with_raw_response.get_pause_state(request_options=request_options))

    async def pause(
        self,
        *,
        body: V1ControlPauseRequest | V1ControlPauseRequestDict | None = None,
        request_options: RequestOptionsOrDict | None = None,
    ) -> Any:
        """Block every new proposal and approval (503)

        Args:
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(await self._with_raw_response.pause(body=body, request_options=request_options))

    async def resume(
        self,
        *,
        body: V1ControlResumeRequest | V1ControlResumeRequestDict | None = None,
        request_options: RequestOptionsOrDict | None = None,
    ) -> Any:
        """Lift the kill-switch

        Args:
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(await self._with_raw_response.resume(body=body, request_options=request_options))

    @property
    def with_raw_response(self) -> AsyncControlWithRawResponse:
        return self._with_raw_response


class ControlWithRawResponse(SecuredRawResponse[RawClient, Server, AuthSchemes]):
    def get_pause_state(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[PauseState, GetPauseStateErrorBody]:
        """Kill-switch state

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="GET",
            url_template=self._server.default("/v1/control/pause"),
            auth_scheme=self._auth.admin,
            decoder=json_decoder[PauseState],
            error_mapper=get_pause_state_error_mapper,
            request_options=request_options,
        )

    def pause(
        self,
        *,
        body: V1ControlPauseRequest | V1ControlPauseRequestDict | None = None,
        request_options: RequestOptionsOrDict | None = None,
    ) -> ApiResult[Any, PauseErrorBody]:
        """Block every new proposal and approval (503)

        Args:
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="POST",
            url_template=self._server.default("/v1/control/pause"),
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            body=json_body[V1ControlPauseRequest | V1ControlPauseRequestDict | None](body),
            auth_scheme=self._auth.admin,
            decoder=json_decoder[Any],
            error_mapper=pause_error_mapper,
            request_options=request_options,
        )

    def resume(
        self,
        *,
        body: V1ControlResumeRequest | V1ControlResumeRequestDict | None = None,
        request_options: RequestOptionsOrDict | None = None,
    ) -> ApiResult[Any, ResumeErrorBody]:
        """Lift the kill-switch

        Args:
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="POST",
            url_template=self._server.default("/v1/control/resume"),
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            body=json_body[V1ControlResumeRequest | V1ControlResumeRequestDict | None](body),
            auth_scheme=self._auth.admin,
            decoder=json_decoder[Any],
            error_mapper=resume_error_mapper,
            request_options=request_options,
        )


class AsyncControlWithRawResponse(SecuredRawResponse[AsyncRawClient, Server, AsyncAuthSchemes]):
    async def get_pause_state(
        self, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[PauseState, GetPauseStateErrorBody]:
        """Kill-switch state

        Args:
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="GET",
            url_template=self._server.default("/v1/control/pause"),
            auth_scheme=self._auth.admin,
            decoder=async_json_decoder[PauseState],
            error_mapper=get_pause_state_error_mapper,
            request_options=request_options,
        )

    async def pause(
        self,
        *,
        body: V1ControlPauseRequest | V1ControlPauseRequestDict | None = None,
        request_options: RequestOptionsOrDict | None = None,
    ) -> ApiResult[Any, PauseErrorBody]:
        """Block every new proposal and approval (503)

        Args:
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="POST",
            url_template=self._server.default("/v1/control/pause"),
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            body=json_body[V1ControlPauseRequest | V1ControlPauseRequestDict | None](body),
            auth_scheme=self._auth.admin,
            decoder=async_json_decoder[Any],
            error_mapper=pause_error_mapper,
            request_options=request_options,
        )

    async def resume(
        self,
        *,
        body: V1ControlResumeRequest | V1ControlResumeRequestDict | None = None,
        request_options: RequestOptionsOrDict | None = None,
    ) -> ApiResult[Any, ResumeErrorBody]:
        """Lift the kill-switch

        Args:
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="POST",
            url_template=self._server.default("/v1/control/resume"),
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            body=json_body[V1ControlResumeRequest | V1ControlResumeRequestDict | None](body),
            auth_scheme=self._auth.admin,
            decoder=async_json_decoder[Any],
            error_mapper=resume_error_mapper,
            request_options=request_options,
        )
