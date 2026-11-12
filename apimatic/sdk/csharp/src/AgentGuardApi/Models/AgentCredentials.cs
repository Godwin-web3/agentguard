using System.Text.Json.Serialization;
using AgentGuardApi.Core.Models;

namespace AgentGuardApi.Models;

public record AgentCredentials
{
    [JsonPropertyName("agent_id")]
    public required string AgentId { get; init; }

    /// <summary>
    /// Shown once; store it as the agent's secret
    /// </summary>
    [JsonPropertyName("api_key")]
    public required string ApiKey { get; init; }

    [JsonExtensionData]
    public AdditionalProperties AdditionalProperties { get; init; } = [];
}
