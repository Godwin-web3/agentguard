namespace AgentGuardApi.Requests.Setup;

/// <summary>
/// The inputs of the CompleteWalletSetup operation.
/// </summary>
public sealed record CompleteWalletSetupRequest
{
    /// <summary>
    /// One-time state from /v1/wallets/setup
    /// </summary>
    public string? State { get; init; }

    /// <summary>
    /// PayPal setup token id
    /// </summary>
    public string? ApprovalTokenId { get; init; }
}
