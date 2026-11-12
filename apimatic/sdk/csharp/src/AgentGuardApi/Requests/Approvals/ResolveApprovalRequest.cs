using AgentGuardApi.Models;

namespace AgentGuardApi.Requests.Approvals;

/// <summary>
/// The inputs of the ResolveApproval operation.
/// </summary>
public sealed record ResolveApprovalRequest
{
    public required string Id { get; init; }

    public required V1ApprovalsRequest Body { get; init; }
}
