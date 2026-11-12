using System.Collections.Generic;
using System.Text.Json.Serialization;
using AgentGuardApi.Core.Models;

namespace AgentGuardApi.Models;

public record ProductSearchResult
{
    [JsonPropertyName("provider")]
    public required string Provider { get; init; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonPropertyName("mandate_id")]
    public string? MandateId { get; init; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonPropertyName("query")]
    public string? Query { get; init; }

    /// <summary>
    /// Price ceiling applied: min(per-payment cap, remaining budget)
    /// </summary>
    [JsonPropertyName("max_price")]
    public required string MaxPrice { get; init; }

    [JsonPropertyName("currency")]
    public required string Currency { get; init; }

    [JsonPropertyName("products")]
    public required IReadOnlyList<CatalogProduct> Products { get; init; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonPropertyName("next_page_token")]
    public string? NextPageToken { get; init; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonPropertyName("how_to_pay")]
    public string? HowToPay { get; init; }

    [JsonExtensionData]
    public AdditionalProperties AdditionalProperties { get; init; } = [];
}
