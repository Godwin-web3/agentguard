from __future__ import annotations

from functools import cached_property
from types import TracebackType

from typing_extensions import Self

from .apis.agent import Agent
from .apis.approvals import Approvals
from .apis.audit import Audit
from .apis.catalog import Catalog
from .apis.control import Control
from .apis.jobs import Jobs
from .apis.keys import Keys
from .apis.mandates import Mandates
from .apis.meta import Meta
from .apis.passkeys import Passkeys
from .apis.payments import Payments
from .apis.receipts import Receipts
from .apis.setup import Setup
from .auth import AuthSchemes
from .base_client import DEFAULT_TIMEOUT, BaseAgentGuardApiClient
from .core import (
    OPERATING_SYSTEM,
    PYTHON_RUNTIME,
    BearerAuthScheme,
    HttpClient,
    Httpx2Client,
    LoggingOptionsOrDict,
    RawClient,
    RetryOptionsOrDict,
    no_auth,
    param,
)
from .server.environment import Environment


class AgentGuardApiClient(BaseAgentGuardApiClient[RawClient]):
    def __init__(
        self,
        *,
        environment: Environment = "production",
        base_url: str | None = None,
        timeout: float = DEFAULT_TIMEOUT,
        retry_options: int | RetryOptionsOrDict | None = None,
        logging_options: LoggingOptionsOrDict | None = None,
        custom_http_client: HttpClient | None = None,
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
        self._raw_client = RawClient(
            http_client=custom_http_client if custom_http_client is not None else Httpx2Client(timeout=timeout),
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
        self._auth = AuthSchemes(
            admin=BearerAuthScheme(admin) if admin is not None else no_auth,
            agent=BearerAuthScheme(agent) if agent is not None else no_auth,
            cron=BearerAuthScheme(cron) if cron is not None else no_auth,
        )

    @cached_property
    def agent(self) -> Agent:
        return Agent(self._raw_client, self._server, self._auth)

    @cached_property
    def approvals(self) -> Approvals:
        return Approvals(self._raw_client, self._server, self._auth)

    @cached_property
    def audit(self) -> Audit:
        return Audit(self._raw_client, self._server, self._auth)

    @cached_property
    def catalog(self) -> Catalog:
        return Catalog(self._raw_client, self._server, self._auth)

    @cached_property
    def control(self) -> Control:
        return Control(self._raw_client, self._server, self._auth)

    @cached_property
    def jobs(self) -> Jobs:
        return Jobs(self._raw_client, self._server, self._auth)

    @cached_property
    def keys(self) -> Keys:
        return Keys(self._raw_client, self._server, self._auth)

    @cached_property
    def mandates(self) -> Mandates:
        return Mandates(self._raw_client, self._server, self._auth)

    @cached_property
    def meta(self) -> Meta:
        return Meta(self._raw_client, self._server)

    @cached_property
    def passkeys(self) -> Passkeys:
        return Passkeys(self._raw_client, self._server, self._auth)

    @cached_property
    def payments(self) -> Payments:
        return Payments(self._raw_client, self._server, self._auth)

    @cached_property
    def receipts(self) -> Receipts:
        return Receipts(self._raw_client, self._server, self._auth)

    @cached_property
    def setup(self) -> Setup:
        return Setup(self._raw_client, self._server, self._auth)

    def close(self) -> None:
        self._raw_client.http_client.close()

    def __enter__(self) -> Self:
        return self

    def __exit__(
        self, exc_type: type[BaseException] | None, exc: BaseException | None, exc_tb: TracebackType | None
    ) -> None:
        self.close()


Client = AgentGuardApiClient
