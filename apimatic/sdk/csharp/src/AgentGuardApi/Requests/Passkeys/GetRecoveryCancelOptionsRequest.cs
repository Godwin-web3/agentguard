namespace AgentGuardApi.Requests.Passkeys;

/// <summary>
/// The inputs of the GetRecoveryCancelOptions operation.
/// </summary>
public sealed record GetRecoveryCancelOptionsRequest
{
    public required string Id { get; init; }
}
