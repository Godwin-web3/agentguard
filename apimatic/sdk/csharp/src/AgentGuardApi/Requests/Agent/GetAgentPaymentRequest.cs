namespace AgentGuardApi.Requests.Agent;

/// <summary>
/// The inputs of the GetAgentPayment operation.
/// </summary>
public sealed record GetAgentPaymentRequest
{
    public required string Id { get; init; }
}
