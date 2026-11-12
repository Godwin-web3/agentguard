using AgentGuardApi.Models;

namespace AgentGuardApi.Requests.Payments;

/// <summary>
/// The inputs of the RecoverPayments operation.
/// </summary>
public sealed record RecoverPaymentsRequest
{
    public V1RecoverRequest? Body { get; init; }
}
