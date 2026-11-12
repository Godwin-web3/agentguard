namespace AgentGuardApi.Requests.Agent;

/// <summary>
/// The inputs of the GetAgentPaymentReceipt operation.
/// </summary>
public sealed record GetAgentPaymentReceiptRequest
{
    public required string Id { get; init; }
}
