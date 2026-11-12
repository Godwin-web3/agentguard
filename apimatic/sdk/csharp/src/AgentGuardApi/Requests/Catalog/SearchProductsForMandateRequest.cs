using AgentGuardApi.Models;

namespace AgentGuardApi.Requests.Catalog;

/// <summary>
/// The inputs of the SearchProductsForMandate operation.
/// </summary>
public sealed record SearchProductsForMandateRequest
{
    public required V1ProductsSearchRequest Body { get; init; }
}
