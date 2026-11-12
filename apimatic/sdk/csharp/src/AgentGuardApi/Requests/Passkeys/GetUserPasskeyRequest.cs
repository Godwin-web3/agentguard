namespace AgentGuardApi.Requests.Passkeys;

/// <summary>
/// The inputs of the GetUserPasskey operation.
/// </summary>
public sealed record GetUserPasskeyRequest
{
    public required string Id { get; init; }
}
