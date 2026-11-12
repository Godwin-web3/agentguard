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
from ..errors.complete_wallet_setup_error import CompleteWalletSetupErrorBody, complete_wallet_setup_error_mapper
from ..errors.link_wallet_error import LinkWalletErrorBody, link_wallet_error_mapper
from ..errors.register_agent_error import RegisterAgentErrorBody, register_agent_error_mapper
from ..errors.start_wallet_setup_error import StartWalletSetupErrorBody, start_wallet_setup_error_mapper
from ..models.agent_credentials import AgentCredentials
from ..models.v1_agents_request import V1AgentsRequest, V1AgentsRequestDict
from ..models.v1_wallets_link_request import V1WalletsLinkRequest, V1WalletsLinkRequestDict
from ..models.v1_wallets_setup_request import V1WalletsSetupRequest, V1WalletsSetupRequestDict
from ..server.server import Server


class Setup:
    def __init__(self, client: RawClient, server: Server, auth: AuthSchemes) -> None:
        self._with_raw_response = SetupWithRawResponse(client, server, auth)

    def complete_wallet_setup(
        self,
        *,
        state: str | None = None,
        approval_token_id: str | None = None,
        request_options: RequestOptionsOrDict | None = None,
    ) -> Any:
        """PayPal redirect target after buyer consent; links the vaulted wallet

        Args:
            state: One-time state from /v1/wallets/setup
            approval_token_id: PayPal setup token id
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Not found Body over 256 KB Internal error ``error`` is ``ErrorResponse |
                RawError``."""
        return unwrap(
            self._with_raw_response.complete_wallet_setup(
                state=state, approval_token_id=approval_token_id, request_options=request_options
            ),
        )

    def link_wallet(
        self,
        body: V1WalletsLinkRequest | V1WalletsLinkRequestDict,
        *,
        request_options: RequestOptionsOrDict | None = None,
    ) -> Any:
        """Link an existing PayPal vault id to a user

        Args:
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(self._with_raw_response.link_wallet(body, request_options=request_options))

    def register_agent(
        self, body: V1AgentsRequest | V1AgentsRequestDict, *, request_options: RequestOptionsOrDict | None = None
    ) -> AgentCredentials:
        """Register an agent and return its API key (shown once)

        Args:
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(self._with_raw_response.register_agent(body, request_options=request_options))

    def start_wallet_setup(
        self,
        body: V1WalletsSetupRequest | V1WalletsSetupRequestDict,
        *,
        request_options: RequestOptionsOrDict | None = None,
    ) -> Any:
        """Start PayPal wallet vaulting; returns the setup token with the buyer consent link

        Args:
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(self._with_raw_response.start_wallet_setup(body, request_options=request_options))

    @property
    def with_raw_response(self) -> SetupWithRawResponse:
        return self._with_raw_response


class AsyncSetup:
    def __init__(self, client: AsyncRawClient, server: Server, auth: AsyncAuthSchemes) -> None:
        self._with_raw_response = AsyncSetupWithRawResponse(client, server, auth)

    async def complete_wallet_setup(
        self,
        *,
        state: str | None = None,
        approval_token_id: str | None = None,
        request_options: RequestOptionsOrDict | None = None,
    ) -> Any:
        """PayPal redirect target after buyer consent; links the vaulted wallet

        Args:
            state: One-time state from /v1/wallets/setup
            approval_token_id: PayPal setup token id
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Not found Body over 256 KB Internal error ``error`` is ``ErrorResponse |
                RawError``."""
        return unwrap(
            await self._with_raw_response.complete_wallet_setup(
                state=state, approval_token_id=approval_token_id, request_options=request_options
            ),
        )

    async def link_wallet(
        self,
        body: V1WalletsLinkRequest | V1WalletsLinkRequestDict,
        *,
        request_options: RequestOptionsOrDict | None = None,
    ) -> Any:
        """Link an existing PayPal vault id to a user

        Args:
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(await self._with_raw_response.link_wallet(body, request_options=request_options))

    async def register_agent(
        self, body: V1AgentsRequest | V1AgentsRequestDict, *, request_options: RequestOptionsOrDict | None = None
    ) -> AgentCredentials:
        """Register an agent and return its API key (shown once)

        Args:
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(await self._with_raw_response.register_agent(body, request_options=request_options))

    async def start_wallet_setup(
        self,
        body: V1WalletsSetupRequest | V1WalletsSetupRequestDict,
        *,
        request_options: RequestOptionsOrDict | None = None,
    ) -> Any:
        """Start PayPal wallet vaulting; returns the setup token with the buyer consent link

        Args:
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(await self._with_raw_response.start_wallet_setup(body, request_options=request_options))

    @property
    def with_raw_response(self) -> AsyncSetupWithRawResponse:
        return self._with_raw_response


class SetupWithRawResponse(SecuredRawResponse[RawClient, Server, AuthSchemes]):
    def complete_wallet_setup(
        self,
        *,
        state: str | None = None,
        approval_token_id: str | None = None,
        request_options: RequestOptionsOrDict | None = None,
    ) -> ApiResult[Any, CompleteWalletSetupErrorBody]:
        """PayPal redirect target after buyer consent; links the vaulted wallet

        Args:
            state: One-time state from /v1/wallets/setup
            approval_token_id: PayPal setup token id
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="GET",
            url_template=self._server.default("/v1/wallets/return"),
            query_params=[param[str | None]("state", state), param[str | None]("approval_token_id", approval_token_id)],
            decoder=json_decoder[Any],
            error_mapper=complete_wallet_setup_error_mapper,
            request_options=request_options,
        )

    def link_wallet(
        self,
        body: V1WalletsLinkRequest | V1WalletsLinkRequestDict,
        *,
        request_options: RequestOptionsOrDict | None = None,
    ) -> ApiResult[Any, LinkWalletErrorBody]:
        """Link an existing PayPal vault id to a user

        Args:
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="POST",
            url_template=self._server.default("/v1/wallets/link"),
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            body=json_body[V1WalletsLinkRequest | V1WalletsLinkRequestDict](body),
            auth_scheme=self._auth.admin,
            decoder=json_decoder[Any],
            error_mapper=link_wallet_error_mapper,
            request_options=request_options,
        )

    def register_agent(
        self, body: V1AgentsRequest | V1AgentsRequestDict, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[AgentCredentials, RegisterAgentErrorBody]:
        """Register an agent and return its API key (shown once)

        Args:
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="POST",
            url_template=self._server.default("/v1/agents"),
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            body=json_body[V1AgentsRequest | V1AgentsRequestDict](body),
            auth_scheme=self._auth.admin,
            decoder=json_decoder[AgentCredentials],
            error_mapper=register_agent_error_mapper,
            request_options=request_options,
        )

    def start_wallet_setup(
        self,
        body: V1WalletsSetupRequest | V1WalletsSetupRequestDict,
        *,
        request_options: RequestOptionsOrDict | None = None,
    ) -> ApiResult[Any, StartWalletSetupErrorBody]:
        """Start PayPal wallet vaulting; returns the setup token with the buyer consent link

        Args:
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="POST",
            url_template=self._server.default("/v1/wallets/setup"),
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            body=json_body[V1WalletsSetupRequest | V1WalletsSetupRequestDict](body),
            auth_scheme=self._auth.admin,
            decoder=json_decoder[Any],
            error_mapper=start_wallet_setup_error_mapper,
            request_options=request_options,
        )


class AsyncSetupWithRawResponse(SecuredRawResponse[AsyncRawClient, Server, AsyncAuthSchemes]):
    async def complete_wallet_setup(
        self,
        *,
        state: str | None = None,
        approval_token_id: str | None = None,
        request_options: RequestOptionsOrDict | None = None,
    ) -> ApiResult[Any, CompleteWalletSetupErrorBody]:
        """PayPal redirect target after buyer consent; links the vaulted wallet

        Args:
            state: One-time state from /v1/wallets/setup
            approval_token_id: PayPal setup token id
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="GET",
            url_template=self._server.default("/v1/wallets/return"),
            query_params=[param[str | None]("state", state), param[str | None]("approval_token_id", approval_token_id)],
            decoder=async_json_decoder[Any],
            error_mapper=complete_wallet_setup_error_mapper,
            request_options=request_options,
        )

    async def link_wallet(
        self,
        body: V1WalletsLinkRequest | V1WalletsLinkRequestDict,
        *,
        request_options: RequestOptionsOrDict | None = None,
    ) -> ApiResult[Any, LinkWalletErrorBody]:
        """Link an existing PayPal vault id to a user

        Args:
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="POST",
            url_template=self._server.default("/v1/wallets/link"),
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            body=json_body[V1WalletsLinkRequest | V1WalletsLinkRequestDict](body),
            auth_scheme=self._auth.admin,
            decoder=async_json_decoder[Any],
            error_mapper=link_wallet_error_mapper,
            request_options=request_options,
        )

    async def register_agent(
        self, body: V1AgentsRequest | V1AgentsRequestDict, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[AgentCredentials, RegisterAgentErrorBody]:
        """Register an agent and return its API key (shown once)

        Args:
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="POST",
            url_template=self._server.default("/v1/agents"),
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            body=json_body[V1AgentsRequest | V1AgentsRequestDict](body),
            auth_scheme=self._auth.admin,
            decoder=async_json_decoder[AgentCredentials],
            error_mapper=register_agent_error_mapper,
            request_options=request_options,
        )

    async def start_wallet_setup(
        self,
        body: V1WalletsSetupRequest | V1WalletsSetupRequestDict,
        *,
        request_options: RequestOptionsOrDict | None = None,
    ) -> ApiResult[Any, StartWalletSetupErrorBody]:
        """Start PayPal wallet vaulting; returns the setup token with the buyer consent link

        Args:
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="POST",
            url_template=self._server.default("/v1/wallets/setup"),
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            body=json_body[V1WalletsSetupRequest | V1WalletsSetupRequestDict](body),
            auth_scheme=self._auth.admin,
            decoder=async_json_decoder[Any],
            error_mapper=start_wallet_setup_error_mapper,
            request_options=request_options,
        )
