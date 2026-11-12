using AgentGuardApi.Models;

namespace AgentGuardApi.Requests.Setup;

/// <summary>
/// The inputs of the StartWalletSetup operation.
/// </summary>
public sealed record StartWalletSetupRequest
{
    public required V1WalletsSetupRequest Body { get; init; }
}
