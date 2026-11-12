using AgentGuardApi.Models;

namespace AgentGuardApi.Requests.Mandates;

/// <summary>
/// The inputs of the DraftMandateFromText operation.
/// </summary>
public sealed record DraftMandateFromTextRequest
{
    public required V1MandatesDraftFromTextRequest Body { get; init; }
}
