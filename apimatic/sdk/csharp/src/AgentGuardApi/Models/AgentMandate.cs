using System.Text.Json.Serialization;
using AgentGuardApi.Core.Models;
using AgentGuardApi.Models.Enums;

namespace AgentGuardApi.Models;

public record AgentMandate
{
    [JsonPropertyName("mandate")]
    public required Mandate Mandate { get; init; }

    [JsonPropertyName("status")]
    public required Status1 Status { get; init; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonPropertyName("spend")]
    public Spend? Spend { get; init; }

    [JsonExtensionData]
    public AdditionalProperties AdditionalProperties { get; init; } = [];
}
