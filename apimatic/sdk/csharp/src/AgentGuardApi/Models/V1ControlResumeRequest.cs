using System.Text.Json.Serialization;
using AgentGuardApi.Core.Models;

namespace AgentGuardApi.Models;

public record V1ControlResumeRequest
{
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonPropertyName("by")]
    public string? By { get; init; }

    [JsonExtensionData]
    public AdditionalProperties AdditionalProperties { get; init; } = [];
}
