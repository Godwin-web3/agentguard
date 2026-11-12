namespace AgentGuardApi.Requests.Mandates;

/// <summary>
/// The inputs of the GetMandateSigningOptions operation.
/// </summary>
public sealed record GetMandateSigningOptionsRequest
{
    public required string Id { get; init; }
}
