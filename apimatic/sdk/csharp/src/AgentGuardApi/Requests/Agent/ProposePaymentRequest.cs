using AgentGuardApi.Models;

namespace AgentGuardApi.Requests.Agent;

/// <summary>
/// The inputs of the ProposePayment operation.
/// </summary>
public sealed record ProposePaymentRequest
{
    public required V1AgentPaymentsRequest Body { get; init; }
}
