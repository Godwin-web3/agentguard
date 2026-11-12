using AgentGuardApi.Models;

namespace AgentGuardApi.Requests.Mandates;

/// <summary>
/// The inputs of the ConfirmMandate operation.
/// </summary>
public sealed record ConfirmMandateRequest
{
    public required string Id { get; init; }

    public required V1MandatesConfirmRequest Body { get; init; }
}
