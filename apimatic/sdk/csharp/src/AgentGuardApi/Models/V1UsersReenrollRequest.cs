using System.Text.Json.Serialization;
using AgentGuardApi.Core.Models;

namespace AgentGuardApi.Models;

public record V1UsersReenrollRequest
{
    /// <summary>
    /// WebAuthn assertion (navigator.credentials.get response, JSON-encoded) over the challenge returned by the matching *-request call
    /// </summary>
    [JsonPropertyName("assertion")]
    public required object Assertion { get; init; }

    [JsonExtensionData]
    public AdditionalProperties AdditionalProperties { get; init; } = [];
}
