using System.Collections.Generic;
using System.Text.Json.Serialization;
using AgentGuardApi.Core.Models;
using AgentGuardApi.Models.Enums;

namespace AgentGuardApi.Models;

public record MandateConstraints
{
    /// <summary>
    /// ISO 4217
    /// </summary>
    [JsonPropertyName("currency")]
    public required string Currency { get; init; }

    [JsonPropertyName("max_total")]
    public required string MaxTotal { get; init; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonPropertyName("max_per_transaction")]
    public string? MaxPerTransaction { get; init; }

    [JsonPropertyName("max_transactions")]
    public required int MaxTransactions { get; init; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonPropertyName("allowed_categories")]
    public IReadOnlyList<AllowedCategory>? AllowedCategories { get; init; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonPropertyName("payee_allowlist")]
    public IReadOnlyList<string>? PayeeAllowlist { get; init; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonPropertyName("payee_blocklist")]
    public IReadOnlyList<string>? PayeeBlocklist { get; init; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonPropertyName("max_quantity_per_item")]
    public int? MaxQuantityPerItem { get; init; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonPropertyName("require_human_approval_over")]
    public string? RequireHumanApprovalOver { get; init; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonPropertyName("require_merchant_order")]
    public bool? RequireMerchantOrder { get; init; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonPropertyName("sku_allowlist")]
    public IReadOnlyList<string>? SkuAllowlist { get; init; }

    [JsonExtensionData]
    public AdditionalProperties AdditionalProperties { get; init; } = [];
}
