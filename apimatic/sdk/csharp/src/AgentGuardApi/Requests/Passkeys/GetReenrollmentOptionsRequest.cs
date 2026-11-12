namespace AgentGuardApi.Requests.Passkeys;

/// <summary>
/// The inputs of the GetReenrollmentOptions operation.
/// </summary>
public sealed record GetReenrollmentOptionsRequest
{
    public required string Id { get; init; }
}
