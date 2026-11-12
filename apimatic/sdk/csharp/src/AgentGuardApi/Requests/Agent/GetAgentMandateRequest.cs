namespace AgentGuardApi.Requests.Agent;

/// <summary>
/// The inputs of the GetAgentMandate operation.
/// </summary>
public sealed record GetAgentMandateRequest
{
    public required string Id { get; init; }
}
