using System.Text.Json.Serialization;
using AgentGuardApi.Core.Models;

namespace AgentGuardApi.Models;

public record V1MandatesDraftFromTextRequest
{
    [JsonPropertyName("user_id")]
    public required string UserId { get; init; }

    [JsonPropertyName("agent_id")]
    public required string AgentId { get; init; }

    [JsonPropertyName("text")]
    public required string Text { get; init; }

    [JsonExtensionData]
    public AdditionalProperties AdditionalProperties { get; init; } = [];
}
