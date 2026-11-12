namespace AgentGuardApi.Requests.Payments;

/// <summary>
/// The inputs of the ListPayments operation.
/// </summary>
public sealed record ListPaymentsRequest
{
    /// <summary>
    /// Default 200
    /// </summary>
    public string? Limit { get; init; }
}
