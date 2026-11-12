namespace AgentGuardApi.Requests.Audit;

/// <summary>
/// The inputs of the ListAuditAnchors operation.
/// </summary>
public sealed record ListAuditAnchorsRequest
{
    /// <summary>
    /// Default 100
    /// </summary>
    public string? Limit { get; init; }
}
