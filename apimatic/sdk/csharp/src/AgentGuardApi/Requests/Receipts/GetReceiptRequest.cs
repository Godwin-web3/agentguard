namespace AgentGuardApi.Requests.Receipts;

/// <summary>
/// The inputs of the GetReceipt operation.
/// </summary>
public sealed record GetReceiptRequest
{
    public required string Id { get; init; }
}
