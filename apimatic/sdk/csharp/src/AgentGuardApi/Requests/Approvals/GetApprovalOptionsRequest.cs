using AgentGuardApi.Models;

namespace AgentGuardApi.Requests.Approvals;

/// <summary>
/// The inputs of the GetApprovalOptions operation.
/// </summary>
public sealed record GetApprovalOptionsRequest
{
    public required string Id { get; init; }

    public required V1ApprovalsRequestRequest Body { get; init; }
}
