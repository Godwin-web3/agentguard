using System.Text.Json.Serialization;
using AgentGuardApi.Core.Models;

namespace AgentGuardApi.Models;

public record Check
{
    [JsonPropertyName("check")]
    public required string CheckValue { get; init; }

    [JsonPropertyName("pass")]
    public required bool Pass { get; init; }

    [JsonPropertyName("detail")]
    public required string Detail { get; init; }

    [JsonExtensionData]
    public AdditionalProperties AdditionalProperties { get; init; } = [];
}
