using System.Text.Json.Serialization;
using AgentGuardApi.Core.Models;
using AgentGuardApi.Models.Enums;

namespace AgentGuardApi.Models;

public record PaymentDecision
{
    [JsonPropertyName("payment_id")]
    public required string PaymentId { get; init; }

    [JsonPropertyName("decision")]
    public required Decision Decision { get; init; }

    [JsonPropertyName("status")]
    public required Status Status { get; init; }

    [JsonPropertyName("evaluation")]
    public required Evaluation Evaluation { get; init; }

    /// <summary>
    /// Set when the payment waits for the user's passkey approval
    /// </summary>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonPropertyName("approval_id")]
    public string? ApprovalId { get; init; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonPropertyName("paypal")]
    public Paypal? Paypal { get; init; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonPropertyName("error")]
    public string? Error { get; init; }

    [JsonExtensionData]
    public AdditionalProperties AdditionalProperties { get; init; } = [];
}
