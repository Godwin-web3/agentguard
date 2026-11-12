using AgentGuardApi.Core;
using AgentGuardApi.Core.Authentication;
using AgentGuardApi.Core.Authentication.Bearer;

namespace AgentGuardApi;

internal sealed class AuthSchemes
{
    public IAuthScheme Admin { get; }
    public IAuthScheme Agent { get; }
    public IAuthScheme Cron { get; }

    public AuthSchemes(AgentGuardApiClientOptions options)
    {
        Admin =
            BearerAuthScheme.Create(
                "Admin",
                options.AdminProvider,
                options.Admin ?? EnvironmentVariables.Get("AGENT_GUARD_API_ADMIN"));
        Agent =
            BearerAuthScheme.Create(
                "Agent",
                options.AgentProvider,
                options.Agent ?? EnvironmentVariables.Get("AGENT_GUARD_API_AGENT"));
        Cron =
            BearerAuthScheme.Create(
                "Cron",
                options.CronProvider,
                options.Cron ?? EnvironmentVariables.Get("AGENT_GUARD_API_CRON"));
    }
}
