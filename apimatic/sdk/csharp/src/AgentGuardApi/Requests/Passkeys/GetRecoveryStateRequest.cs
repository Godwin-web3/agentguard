namespace AgentGuardApi.Requests.Passkeys;

/// <summary>
/// The inputs of the GetRecoveryState operation.
/// </summary>
public sealed record GetRecoveryStateRequest
{
    public required string Id { get; init; }
}
