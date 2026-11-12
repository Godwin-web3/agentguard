using System.Text.Json.Serialization;
using AgentGuardApi.Core.Models;

namespace AgentGuardApi.Models;

/// <summary>
/// Every non-2xx response
/// </summary>
public record ErrorResponseModel
{
    /// <summary>
    /// What went wrong
    /// </summary>
    [JsonPropertyName("error")]
    public required string Error { get; init; }

    [JsonExtensionData]
    public AdditionalProperties AdditionalProperties { get; init; } = [];
}
