using System.Text.Json.Serialization;
using AgentGuardApi.Core.Models;

namespace AgentGuardApi.Models;

public record V1ProductsSearchRequest
{
    [JsonPropertyName("mandate_id")]
    public required string MandateId { get; init; }

    [JsonPropertyName("query")]
    public required string Query { get; init; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonPropertyName("limit")]
    public int? Limit { get; init; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonPropertyName("page_token")]
    public string? PageToken { get; init; }

    [JsonExtensionData]
    public AdditionalProperties AdditionalProperties { get; init; } = [];
}
