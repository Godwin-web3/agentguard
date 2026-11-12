using AgentGuardApi.Models;

namespace AgentGuardApi.Requests.Passkeys;

/// <summary>
/// The inputs of the ReenrollPasskey operation.
/// </summary>
public sealed record ReenrollPasskeyRequest
{
    public required string Id { get; init; }

    public required V1UsersReenrollRequest Body { get; init; }
}
