using AgentGuardApi.Models;

namespace AgentGuardApi.Requests.Setup;

/// <summary>
/// The inputs of the RegisterAgent operation.
/// </summary>
public sealed record RegisterAgentRequest
{
    public required V1AgentsRequest Body { get; init; }
}
