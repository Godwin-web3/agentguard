using AgentGuardApi.Models;

namespace AgentGuardApi.Requests.Mandates;

/// <summary>
/// The inputs of the RevokeMandate operation.
/// </summary>
public sealed record RevokeMandateRequest
{
    public required string Id { get; init; }

    public V1MandatesRevokeRequest? Body { get; init; }
}
