using System.Collections.Generic;
using System.Text.Json.Serialization;
using AgentGuardApi.Core.Models;

namespace AgentGuardApi.Models;

public record IssuerKeySet
{
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonPropertyName("issuer")]
    public string? Issuer { get; init; }

    [JsonPropertyName("keys")]
    public required IReadOnlyList<IssuerKey> Keys { get; init; }

    [JsonExtensionData]
    public AdditionalProperties AdditionalProperties { get; init; } = [];
}
