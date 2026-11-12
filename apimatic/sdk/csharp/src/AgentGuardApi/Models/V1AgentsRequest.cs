using System.Text.Json.Serialization;
using AgentGuardApi.Core.Models;

namespace AgentGuardApi.Models;

public record V1AgentsRequest
{
    /// <summary>
    /// Owner user id
    /// </summary>
    [JsonPropertyName("user_id")]
    public required string UserId { get; init; }

    /// <summary>
    /// Agent id
    /// </summary>
    [JsonPropertyName("agent_id")]
    public required string AgentId { get; init; }

    [JsonExtensionData]
    public AdditionalProperties AdditionalProperties { get; init; } = [];
}
