# C# SDK (/sdks/csharp)

[Download SDK](/__downloads/sdk/csharp.zip)

## Intro [#intro]

The AgentGuard API SDK provides access to the AgentGuard API REST APIs.

Financial authorization gateway for AI agents paying through PayPal. Errors are `{"error": string}`. Responses are JSON with `cache-control: no-store`. Docs: https://agentguard-orcin.vercel.app/docs

## Installation [#installation]

Add the SDK as a project reference into your solution:

```bash
dotnet add reference <path-to-sdk>/src/AgentGuardApi/AgentGuardApi.csproj
```

The project takes its build settings from the files around it, so reference it in place.

## Quick Start [#quick-start]

### Dependency Injection [#dependency-injection]

Register the client with `IServiceCollection` and resolve it from the container. The `HttpClient` is managed by `IHttpClientFactory`. Configure the client's behavior through `AgentGuardApiClientOptions`.

```csharp
services.AddAgentGuardApiClient(options =>
{
    options.Admin = "YOUR_BEARER_TOKEN";
    options.Agent = "YOUR_BEARER_TOKEN";
    options.Cron = "YOUR_BEARER_TOKEN";
    options.Environment = ServerEnvironment.Production;
    // TODO: configure more client options here
});
```

### Direct Instantiation [#direct-instantiation]

Create the client by passing an `HttpClient` you manage yourself. Configure the client's behavior through `AgentGuardApiClientOptions`.

```csharp
var httpClient = new HttpClient();
// TODO: configure more client options here
var options = new AgentGuardApiClientOptions
{
    Admin = "YOUR_BEARER_TOKEN",
    Agent = "YOUR_BEARER_TOKEN",
    Cron = "YOUR_BEARER_TOKEN",
    Environment = ServerEnvironment.Production,
};
var client = new AgentGuardApiClient(httpClient, options);
```