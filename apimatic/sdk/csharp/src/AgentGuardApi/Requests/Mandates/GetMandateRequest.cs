namespace AgentGuardApi.Requests.Mandates;

/// <summary>
/// The inputs of the GetMandate operation.
/// </summary>
public sealed record GetMandateRequest
{
    public required string Id { get; init; }
}
