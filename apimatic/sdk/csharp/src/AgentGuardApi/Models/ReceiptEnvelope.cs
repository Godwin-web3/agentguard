using System.Collections.Generic;
using System.Text.Json.Serialization;
using AgentGuardApi.Core.Models;

namespace AgentGuardApi.Models;

public record ReceiptEnvelope
{
    /// <summary>
    /// agentguard.proof-of-intent/v1 receipt: mandate + passkey signature, PayPal order snapshot, decision, capture
    /// </summary>
    [JsonPropertyName("receipt")]
    public required object Receipt { get; init; }

    [JsonPropertyName("signature")]
    public required Signature Signature { get; init; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonPropertyName("timestamps")]
    public IReadOnlyList<object>? Timestamps { get; init; }

    /// <summary>
    /// Merkle inclusion proof for the audit-chain anchor
    /// </summary>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    [JsonPropertyName("anchor")]
    public object? Anchor { get; init; }

    [JsonExtensionData]
    public AdditionalProperties AdditionalProperties { get; init; } = [];
}
