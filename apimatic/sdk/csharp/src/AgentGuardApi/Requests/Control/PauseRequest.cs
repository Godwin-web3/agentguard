using AgentGuardApi.Models;

namespace AgentGuardApi.Requests.Control;

/// <summary>
/// The inputs of the Pause operation.
/// </summary>
public sealed record PauseRequest
{
    public V1ControlPauseRequest? Body { get; init; }
}
