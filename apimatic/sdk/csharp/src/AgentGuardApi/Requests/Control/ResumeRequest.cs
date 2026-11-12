using AgentGuardApi.Models;

namespace AgentGuardApi.Requests.Control;

/// <summary>
/// The inputs of the Resume operation.
/// </summary>
public sealed record ResumeRequest
{
    public V1ControlResumeRequest? Body { get; init; }
}
