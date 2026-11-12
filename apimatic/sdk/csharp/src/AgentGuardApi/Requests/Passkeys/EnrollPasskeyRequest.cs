using AgentGuardApi.Models;

namespace AgentGuardApi.Requests.Passkeys;

/// <summary>
/// The inputs of the EnrollPasskey operation.
/// </summary>
public sealed record EnrollPasskeyRequest
{
    public required V1EnrollRequest Body { get; init; }
}
