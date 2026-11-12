namespace AgentGuardApi.Requests.Receipts;

/// <summary>
/// The inputs of the GetPublicReceipt operation.
/// </summary>
public sealed record GetPublicReceiptRequest
{
    public required string Id { get; init; }
}
