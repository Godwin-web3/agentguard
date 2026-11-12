namespace AgentGuardApi.Requests.Audit;

/// <summary>
/// The inputs of the ListAuditEntries operation.
/// </summary>
public sealed record ListAuditEntriesRequest
{
    /// <summary>
    /// Default 200
    /// </summary>
    public string? Limit { get; init; }
}
