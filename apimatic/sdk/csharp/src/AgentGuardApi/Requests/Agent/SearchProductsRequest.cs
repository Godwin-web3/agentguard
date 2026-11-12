using AgentGuardApi.Models;

namespace AgentGuardApi.Requests.Agent;

/// <summary>
/// The inputs of the SearchProducts operation.
/// </summary>
public sealed record SearchProductsRequest
{
    public required V1AgentProductsSearchRequest Body { get; init; }
}
