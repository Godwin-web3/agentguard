using System.Text.Json.Serialization;
using AgentGuardApi.Core.Models;

namespace AgentGuardApi.Models;

public record V1MandatesRequest
{
    [JsonPropertyName("user_id")]
    public required string UserId { get; init; }

    [JsonPropertyName("agent_id")]
    public required string AgentId { get; init; }

    [JsonPropertyName("purpose")]
    public required string Purpose { get; init; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonPropertyName("ttl_minutes")]
    public int? TtlMinutes { get; init; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonPropertyName("constraints")]
    public MandateConstraints? Constraints { get; init; }

    [JsonExtensionData]
    public AdditionalProperties AdditionalProperties { get; init; } = [];
}
