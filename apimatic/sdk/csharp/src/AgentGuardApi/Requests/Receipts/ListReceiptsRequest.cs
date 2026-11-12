namespace AgentGuardApi.Requests.Receipts;

/// <summary>
/// The inputs of the ListReceipts operation.
/// </summary>
public sealed record ListReceiptsRequest
{
    /// <summary>
    /// Default 100
    /// </summary>
    public string? Limit { get; init; }
}
