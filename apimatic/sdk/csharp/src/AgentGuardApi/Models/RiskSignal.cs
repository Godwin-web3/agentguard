using System.Text.Json.Serialization;
using AgentGuardApi.Core.Models;
using AgentGuardApi.Models.Enums;

namespace AgentGuardApi.Models;

public record RiskSignal
{
    [JsonPropertyName("signal")]
    public required string Signal { get; init; }

    [JsonPropertyName("severity")]
    public required Severity Severity { get; init; }

    [JsonPropertyName("detail")]
    public required string Detail { get; init; }

    [JsonExtensionData]
    public AdditionalProperties AdditionalProperties { get; init; } = [];
}
