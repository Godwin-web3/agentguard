using AgentGuardApi.Models;

namespace AgentGuardApi.Requests.Keys;

/// <summary>
/// The inputs of the MarkKeyCompromised operation.
/// </summary>
public sealed record MarkKeyCompromisedRequest
{
    public required string Kid { get; init; }

    public V1KeysCompromisedRequest? Body { get; init; }
}
