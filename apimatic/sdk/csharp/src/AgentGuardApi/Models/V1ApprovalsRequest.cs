using System.Text.Json.Serialization;
using AgentGuardApi.Core.Models;

namespace AgentGuardApi.Models;

public record V1ApprovalsRequest
{
    [JsonPropertyName("approve")]
    public required bool Approve { get; init; }

    /// <summary>
    /// WebAuthn assertion (navigator.credentials.get response, JSON-encoded) over the challenge returned by the matching *-request call
    /// </summary>
    [JsonPropertyName("assertion")]
    public required object Assertion { get; init; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonPropertyName("approver")]
    public string? Approver { get; init; }

    [JsonExtensionData]
    public AdditionalProperties AdditionalProperties { get; init; } = [];
}
