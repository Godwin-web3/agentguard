using AgentGuardApi.Models;

namespace AgentGuardApi.Requests.Mandates;

/// <summary>
/// The inputs of the CreateMandate operation.
/// </summary>
public sealed record CreateMandateRequest
{
    public required V1MandatesRequest Body { get; init; }
}
