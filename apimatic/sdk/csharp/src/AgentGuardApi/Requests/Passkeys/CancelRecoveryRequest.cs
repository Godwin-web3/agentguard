using AgentGuardApi.Models;

namespace AgentGuardApi.Requests.Passkeys;

/// <summary>
/// The inputs of the CancelRecovery operation.
/// </summary>
public sealed record CancelRecoveryRequest
{
    public required string Id { get; init; }

    public required V1UsersRecoveryCancelRequest Body { get; init; }
}
