namespace AgentGuardApi.Requests.Receipts;

/// <summary>
/// The inputs of the GetPaymentReceipt operation.
/// </summary>
public sealed record GetPaymentReceiptRequest
{
    public required string Id { get; init; }
}
