using System.Text.Json.Serialization;
using AgentGuardApi.Core.Models;

namespace AgentGuardApi.Models;

public record V1EnrollRequest
{
    [JsonPropertyName("token")]
    public required string Token { get; init; }

    /// <summary>
    /// navigator.credentials.create response
    /// </summary>
    [JsonPropertyName("response")]
    public required object Response { get; init; }

    [JsonExtensionData]
    public AdditionalProperties AdditionalProperties { get; init; } = [];
}
