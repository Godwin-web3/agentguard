using System.Text.Json.Serialization;
using AgentGuardApi.Core.Models;

namespace AgentGuardApi.Models;

public record Health
{
    [JsonPropertyName("ok")]
    public required bool Ok { get; init; }

    /// <summary>
    /// Payments stuck in reserved/authorized for over a minute
    /// </summary>
    [JsonPropertyName("stuck")]
    public required int Stuck { get; init; }

    /// <summary>
    /// Last reconciliation run
    /// </summary>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonPropertyName("last_recovery")]
    public object? LastRecovery { get; init; }

    [JsonExtensionData]
    public AdditionalProperties AdditionalProperties { get; init; } = [];
}
