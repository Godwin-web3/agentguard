from __future__ import annotations

from functools import cached_property
from types import TracebackType

from typing_extensions import Self

from .apis.agent import AsyncAgent
from .apis.approvals import AsyncApprovals
from .apis.audit import AsyncAudit
from .apis.catalog import AsyncCatalog
from .apis.control import AsyncControl
from .apis.jobs import AsyncJobs
from .apis.keys import AsyncKeys
from .apis.mandates import AsyncMandates
from .apis.meta import AsyncMeta
from .apis.passkeys import AsyncPasskeys
from .apis.payments import AsyncPayments
from .apis.receipts import AsyncReceipts
from .apis.setup import AsyncSetup
from .auth import AsyncAuthSchemes
from .base_client import DEFAULT_TIMEOUT, BaseAgentGuardApiClient
from .core import (
    OPERATING_SYSTEM,
    PYTHON_RUNTIME,
    AsyncHttpClient,
    AsyncHttpx2Client,
    AsyncRawClient,
    BearerAuthScheme,
    LoggingOptionsOrDict,
    RetryOptionsOrDict,
    no_auth,
    param,
)
from .server.environment import Environment


class AsyncAgentGuardApiClient(BaseAgentGuardApiClient[AsyncRawClient]):
    def __init__(
        self,
        *,
        environment: Environment = "production",
        base_url: str | None = None,
        timeout: float = DEFAULT_TIMEOUT,
        retry_options: int | RetryOptionsOrDict | None = None,
        logging_options: LoggingOptionsOrDict | None = None,
        custom_async_http_client: AsyncHttpClient | None = None,
        admin: str | None = None,
        agent: str | None = None,
        cron: str | None = None,
    ) -> None:
        super().__init__(
            environment=environment,
            base_url=base_url,
            timeout=timeout,
            retry_options=retry_options,
            logging_options=logging_options,
        )
        self._raw_client = AsyncRawClient(
            http_client=(
                custom_async_http_client if custom_async_http_client is not None else AsyncHttpx2Client(timeout=timeout)
            ),
            retry_options=self._retry_options,
            logging_options=self._logging_options,
            global_headers=[
                param[str]("User-Agent", "AgentGuardApiClient/0.1.0 Python"),
                param[str]("X-APIMatic-Lang", "Python"),
                param[str]("X-APIMatic-Package-Version", "0.1.0"),
                param[str]("X-APIMatic-Gen-Version", "4.0.0"),
                param[str]("X-APIMatic-OS", OPERATING_SYSTEM),
                param[str]("X-APIMatic-Runtime", PYTHON_RUNTIME),
            ],
        )
        self._auth = AsyncAuthSchemes(
            admin=BearerAuthScheme(admin) if admin is not None else no_auth,
            agent=BearerAuthScheme(agent) if agent is not None else no_auth,
            cron=BearerAuthScheme(cron) if cron is not None else no_auth,
        )

    @cached_property
    def agent(self) -> AsyncAgent:
        return AsyncAgent(self._raw_client, self._server, self._auth)

    @cached_property
    def approvals(self) -> AsyncApprovals:
        return AsyncApprovals(self._raw_client, self._server, self._auth)

    @cached_property
    def audit(self) -> AsyncAudit:
        return AsyncAudit(self._raw_client, self._server, self._auth)

    @cached_property
    def catalog(self) -> AsyncCatalog:
        return AsyncCatalog(self._raw_client, self._server, self._auth)

    @cached_property
    def control(self) -> AsyncControl:
        return AsyncControl(self._raw_client, self._server, self._auth)

    @cached_property
    def jobs(self) -> AsyncJobs:
        return AsyncJobs(self._raw_client, self._server, self._auth)

    @cached_property
    def keys(self) -> AsyncKeys:
        return AsyncKeys(self._raw_client, self._server, self._auth)

    @cached_property
    def mandates(self) -> AsyncMandates:
        return AsyncMandates(self._raw_client, self._server, self._auth)

    @cached_property
    def meta(self) -> AsyncMeta:
        return AsyncMeta(self._raw_client, self._server)

    @cached_property
    def passkeys(self) -> AsyncPasskeys:
        return AsyncPasskeys(self._raw_client, self._server, self._auth)

    @cached_property
    def payments(self) -> AsyncPayments:
        return AsyncPayments(self._raw_client, self._server, self._auth)

    @cached_property
    def receipts(self) -> AsyncReceipts:
        return AsyncReceipts(self._raw_client, self._server, self._auth)

    @cached_property
    def setup(self) -> AsyncSetup:
        return AsyncSetup(self._raw_client, self._server, self._auth)

    async def aclose(self) -> None:
        await self._raw_client.http_client.aclose()

    async def __aenter__(self) -> Self:
        return self

    async def __aexit__(
        self, exc_type: type[BaseException] | None, exc: BaseException | None, exc_tb: TracebackType | None
    ) -> None:
        await self.aclose()


AsyncClient = AsyncAgentGuardApiClient
