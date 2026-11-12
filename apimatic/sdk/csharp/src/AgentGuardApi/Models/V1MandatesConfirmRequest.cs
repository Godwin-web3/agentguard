using System.Text.Json.Serialization;
using AgentGuardApi.Core.Models;

namespace AgentGuardApi.Models;

public record V1MandatesConfirmRequest
{
    [JsonPropertyName("mandate_hash")]
    public required string MandateHash { get; init; }

    /// <summary>
    /// WebAuthn assertion (navigator.credentials.get response, JSON-encoded) over the challenge returned by the matching *-request call
    /// </summary>
    [JsonPropertyName("assertion")]
    public required object Assertion { get; init; }

    [JsonExtensionData]
    public AdditionalProperties AdditionalProperties { get; init; } = [];
}
