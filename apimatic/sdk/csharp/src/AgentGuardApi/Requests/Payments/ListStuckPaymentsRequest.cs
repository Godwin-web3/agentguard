namespace AgentGuardApi.Requests.Payments;

/// <summary>
/// The inputs of the ListStuckPayments operation.
/// </summary>
public sealed record ListStuckPaymentsRequest
{
    /// <summary>
    /// Default 60000
    /// </summary>
    public string? OlderThanMs { get; init; }
}
