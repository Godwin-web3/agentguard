using AgentGuardApi.Models;

namespace AgentGuardApi.Requests.Passkeys;

/// <summary>
/// The inputs of the GetEnrollmentOptions operation.
/// </summary>
public sealed record GetEnrollmentOptionsRequest
{
    public required V1EnrollOptionsRequest Body { get; init; }
}
