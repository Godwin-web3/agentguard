using System.Text.Json.Serialization;
using AgentGuardApi.Core.Models;

namespace AgentGuardApi.Models;

public record ReceiptSummary
{
    [JsonPropertyName("receipt_id")]
    public required string ReceiptId { get; init; }

    [JsonPropertyName("payment_id")]
    public required string PaymentId { get; init; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonPropertyName("capture_id")]
    public string? CaptureId { get; init; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonPropertyName("receipt_hash")]
    public string? ReceiptHash { get; init; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonPropertyName("issued_at")]
    public string? IssuedAt { get; init; }

    [JsonExtensionData]
    public AdditionalProperties AdditionalProperties { get; init; } = [];
}
