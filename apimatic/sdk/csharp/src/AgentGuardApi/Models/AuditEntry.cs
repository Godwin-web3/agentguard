using System.Text.Json.Serialization;
using AgentGuardApi.Core.Models;

namespace AgentGuardApi.Models;

public record AuditEntry
{
    [JsonPropertyName("seq")]
    public required int Seq { get; init; }

    [JsonPropertyName("ts")]
    public required string Ts { get; init; }

    [JsonPropertyName("event")]
    public required string Event { get; init; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonPropertyName("ref")]
    public string? Ref { get; init; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonPropertyName("payload")]
    public object? Payload { get; init; }

    [JsonPropertyName("prev_hash")]
    public required string PrevHash { get; init; }

    /// <summary>
    /// sha256(prev_hash|ts|event|ref|canonical(payload))
    /// </summary>
    [JsonPropertyName("hash")]
    public required string Hash { get; init; }

    [JsonExtensionData]
    public AdditionalProperties AdditionalProperties { get; init; } = [];
}
