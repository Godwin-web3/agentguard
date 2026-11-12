using System.Collections.Generic;
using System.Text.Json.Serialization;
using AgentGuardApi.Core.Models;

namespace AgentGuardApi.Models;

public record V1AgentPaymentsRequest
{
    [JsonPropertyName("mandate_id")]
    public required string MandateId { get; init; }

    [JsonPropertyName("agent_id")]
    public required string AgentId { get; init; }

    [JsonPropertyName("idempotency_key")]
    public required string IdempotencyKey { get; init; }

    /// <summary>
    /// Merchant-created AUTHORIZE order (preferred). Do not combine with payee/currency/items.
    /// </summary>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonPropertyName("paypal_order_id")]
    public string? PaypalOrderId { get; init; }

    /// <summary>
    /// Vaulted path only (untrusted)
    /// </summary>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonPropertyName("payee")]
    public Payee? Payee { get; init; }

    /// <summary>
    /// Vaulted path only
    /// </summary>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonPropertyName("currency")]
    public string? Currency { get; init; }

    /// <summary>
    /// Vaulted path only (untrusted)
    /// </summary>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonPropertyName("items")]
    public IReadOnlyList<object>? Items { get; init; }

    /// <summary>
    /// Untrusted context the agent saw; scored for injection, advisory only
    /// </summary>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonPropertyName("context")]
    public IReadOnlyList<Context>? Context { get; init; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonPropertyName("agent_rationale")]
    public string? AgentRationale { get; init; }

    [JsonExtensionData]
    public AdditionalProperties AdditionalProperties { get; init; } = [];
}
