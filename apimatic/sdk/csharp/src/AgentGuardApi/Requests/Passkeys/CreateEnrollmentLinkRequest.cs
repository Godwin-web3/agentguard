using AgentGuardApi.Models;

namespace AgentGuardApi.Requests.Passkeys;

/// <summary>
/// The inputs of the CreateEnrollmentLink operation.
/// </summary>
public sealed record CreateEnrollmentLinkRequest
{
    public required string Id { get; init; }

    public V1UsersEnrollmentsRequest? Body { get; init; }
}
