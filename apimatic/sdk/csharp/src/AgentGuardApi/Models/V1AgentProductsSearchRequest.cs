using System.Text.Json.Serialization;
using AgentGuardApi.Core.Models;

namespace AgentGuardApi.Models;

public record V1AgentProductsSearchRequest
{
    [JsonPropertyName("mandate_id")]
    public required string MandateId { get; init; }

    [JsonPropertyName("query")]
    public required string Query { get; init; }

    /// <summary>
    /// 1-30, default 8
    /// </summary>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonPropertyName("limit")]
    public int? Limit { get; init; }

    /// <summary>
    /// next_page_token from a previous search
    /// </summary>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonPropertyName("page_token")]
    public string? PageToken { get; init; }

    [JsonExtensionData]
    public AdditionalProperties AdditionalProperties { get; init; } = [];
}
