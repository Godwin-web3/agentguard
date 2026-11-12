namespace AgentGuardApi.Requests.Mandates;

/// <summary>
/// The inputs of the GetMandateRevocationOptions operation.
/// </summary>
public sealed record GetMandateRevocationOptionsRequest
{
    public required string Id { get; init; }
}
