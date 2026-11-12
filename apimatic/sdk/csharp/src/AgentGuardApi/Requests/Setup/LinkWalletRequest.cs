using AgentGuardApi.Models;

namespace AgentGuardApi.Requests.Setup;

/// <summary>
/// The inputs of the LinkWallet operation.
/// </summary>
public sealed record LinkWalletRequest
{
    public required V1WalletsLinkRequest Body { get; init; }
}
