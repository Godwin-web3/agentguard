using System;
using System.Text.Json.Serialization;
using AgentGuardApi.Core.Enum;

namespace AgentGuardApi.Models.Enums;

[JsonConverter(typeof(StringEnumConverter<AllowedCategory>))]
public sealed record AllowedCategory : OpenStringEnum<AllowedCategory>
{
    private AllowedCategory(string value) : base(value)
    {
    }

    public static readonly AllowedCategory PhysicalGoods = new("PHYSICAL_GOODS");

    public static readonly AllowedCategory DigitalGoods = new("DIGITAL_GOODS");

    public static readonly AllowedCategory Donation = new("DONATION");

    public static readonly AllowedCategory Unspecified = new("UNSPECIFIED");

    public TResult Match<TResult>(Func<TResult> onPhysicalGoods,
        Func<TResult> onDigitalGoods,
        Func<TResult> onDonation,
        Func<TResult> onUnspecified,
        Func<string, TResult> otherwise) =>
        this switch
        {
            _ when this == PhysicalGoods => onPhysicalGoods(),
            _ when this == DigitalGoods => onDigitalGoods(),
            _ when this == Donation => onDonation(),
            _ when this == Unspecified => onUnspecified(),
            _ => otherwise(Value)
        };

    public void Match(Action onPhysicalGoods,
        Action onDigitalGoods,
        Action onDonation,
        Action onUnspecified,
        Action<string> otherwise)
    {
        if (this == PhysicalGoods) onPhysicalGoods();
        else if (this == DigitalGoods) onDigitalGoods();
        else if (this == Donation) onDonation();
        else if (this == Unspecified) onUnspecified();
        else otherwise(Value);
    }
}
