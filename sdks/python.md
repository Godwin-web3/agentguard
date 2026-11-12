# Python SDK (/sdks/python)

[Download SDK](/__downloads/sdk/python.zip)

## Intro [#intro]

The AgentGuard API SDK provides access to the AgentGuard API REST APIs.

Financial authorization gateway for AI agents paying through PayPal. Errors are `{"error": string}`. Responses are JSON with `cache-control: no-store`. Docs: https://agentguard-orcin.vercel.app/docs

## Installation [#installation]

Add the SDK to your project from its folder, with whichever package manager your project uses. Give each tool a path containing a slash, such as `../agent-guard-api` — a bare folder name is looked up on PyPI instead, and resolves to whatever project holds that name there:

```bash
pip install <path-to-sdk>
```

```bash
uv add <path-to-sdk>
```

```bash
poetry add <path-to-sdk>
```

## Quick Start [#quick-start]

### Synchronous client [#synchronous-client]

Construct `AgentGuardApiClient` with keyword arguments, and call `close()` when you are done. Every argument is optional.

```python
from agent_guard_api import AgentGuardApiClient

client = AgentGuardApiClient(
    admin="YOUR_BEARER_TOKEN", agent="YOUR_BEARER_TOKEN", cron="YOUR_BEARER_TOKEN", environment="production"
)

client.close()
```

Alternatively, scope it — `with AgentGuardApiClient(...) as client:` closes the pool on exit.

### Asynchronous client [#asynchronous-client]

`AsyncAgentGuardApiClient` mirrors `AgentGuardApiClient` with **identical method names**, and every endpoint method is a coroutine. It takes the same arguments, with some differences — for example, the transport argument is `custom_async_http_client`.

```python
from asyncio import run

from agent_guard_api import AsyncAgentGuardApiClient

async def main() -> None:
    client = AsyncAgentGuardApiClient(
        admin="YOUR_BEARER_TOKEN", agent="YOUR_BEARER_TOKEN", cron="YOUR_BEARER_TOKEN", environment="production"
    )
    await client.aclose()

run(main())
```

Alternatively, scope it — `async with AsyncAgentGuardApiClient(...) as client:` closes the pool on exit.