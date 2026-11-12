using System;
using System.Text.Json.Serialization;
using AgentGuardApi.Core.Enum;

namespace AgentGuardApi.Models.Enums;

[JsonConverter(typeof(StringEnumConverter<Decision>))]
public sealed record Decision : OpenStringEnum<Decision>
{
    private Decision(string value) : base(value)
    {
    }

    public static readonly Decision Approve = new("approve");

    public static readonly Decision Reject = new("reject");

    public static readonly Decision NeedsHuman = new("needs_human");

    public TResult Match<TResult>(Func<TResult> onApprove,
        Func<TResult> onReject,
        Func<TResult> onNeedsHuman,
        Func<string, TResult> otherwise) =>
        this switch
        {
            _ when this == Approve => onApprove(),
            _ when this == Reject => onReject(),
            _ when this == NeedsHuman => onNeedsHuman(),
            _ => otherwise(Value)
        };

    public void Match(Action onApprove, Action onReject, Action onNeedsHuman, Action<string> otherwise)
    {
        if (this == Approve) onApprove();
        else if (this == Reject) onReject();
        else if (this == NeedsHuman) onNeedsHuman();
        else otherwise(Value);
    }
}
