using System;
using System.Collections.Generic;
using AgentGuardApi.Core.Authentication;
using AgentGuardApi.Core.Configuration;
using AgentGuardApi.Core.Hooks;
using AgentGuardApi.Servers;

namespace AgentGuardApi;

public class AgentGuardApiClientOptions
{
    public ServerEnvironment Environment { get; set; } = ServerEnvironment.Default();
    public RetryOptions Retry { get; set; } = RetryOptions.Default();
    public LoggingOptions Logging { get; set; } = new();
    public TimeProvider TimeProvider { get; set; } = TimeProvider.System;
    public ServerOptions Server { get; set; } = new();
    /// <summary>
    /// Maximum time to wait for the next frame of a streaming (SSE) response before the stream is
    /// torn down with a timeout. Bounds only the wait for the server between frames, never the
    /// caller's own processing time. Set to null to wait indefinitely.
    /// </summary>
    public TimeSpan? StreamReadTimeout { get; set; } = TimeSpan.FromSeconds(60);
    public IReadOnlyList<SdkHook> Hooks { get; set; } = [];
    /// <summary>
    /// AGENTGUARD_ADMIN_TOKEN (owner/operator)
    /// </summary>
    public string? Admin { get; set; }
    public CredentialProvider<string>? AdminProvider { get; set; }
    /// <summary>
    /// Per-agent API key from POST /v1/agents
    /// </summary>
    public string? Agent { get; set; }
    public CredentialProvider<string>? AgentProvider { get; set; }
    /// <summary>
    /// CRON_SECRET
    /// </summary>
    public string? Cron { get; set; }
    public CredentialProvider<string>? CronProvider { get; set; }
}
