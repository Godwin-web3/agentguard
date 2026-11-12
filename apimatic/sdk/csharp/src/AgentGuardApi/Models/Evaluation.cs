using System.Collections.Generic;
using System.Text.Json.Serialization;
using AgentGuardApi.Core.Models;
using AgentGuardApi.Models.Enums;

namespace AgentGuardApi.Models;

public record Evaluation
{
    [JsonPropertyName("decision")]
    public required Decision Decision { get; init; }

    /// <summary>
    /// sha256 of the canonical proposal
    /// </summary>
    [JsonPropertyName("proposal_hash")]
    public required string ProposalHash { get; init; }

    /// <summary>
    /// Amount in minor units, from the PayPal order
    /// </summary>
    [JsonPropertyName("amount_minor")]
    public required int AmountMinor { get; init; }

    [JsonPropertyName("checks")]
    public required IReadOnlyList<Check> Checks { get; init; }

    [JsonPropertyName("risk")]
    public required IReadOnlyList<RiskSignal> Risk { get; init; }

    [JsonPropertyName("reasons")]
    public required IReadOnlyList<string> Reasons { get; init; }

    [JsonExtensionData]
    public AdditionalProperties AdditionalProperties { get; init; } = [];
}
