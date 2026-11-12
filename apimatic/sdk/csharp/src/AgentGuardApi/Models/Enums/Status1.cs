using System;
using System.Text.Json.Serialization;
using AgentGuardApi.Core.Enum;

namespace AgentGuardApi.Models.Enums;

[JsonConverter(typeof(StringEnumConverter<Status1>))]
public sealed record Status1 : OpenStringEnum<Status1>
{
    private Status1(string value) : base(value)
    {
    }

    public static readonly Status1 Draft = new("draft");

    public static readonly Status1 Unsigned = new("unsigned");

    public static readonly Status1 Active = new("active");

    public static readonly Status1 Frozen = new("frozen");

    public static readonly Status1 Revoked = new("revoked");

    public static readonly Status1 Exhausted = new("exhausted");

    public static readonly Status1 Expired = new("expired");

    public TResult Match<TResult>(Func<TResult> onDraft,
        Func<TResult> onUnsigned,
        Func<TResult> onActive,
        Func<TResult> onFrozen,
        Func<TResult> onRevoked,
        Func<TResult> onExhausted,
        Func<TResult> onExpired,
        Func<string, TResult> otherwise) =>
        this switch
        {
            _ when this == Draft => onDraft(),
            _ when this == Unsigned => onUnsigned(),
            _ when this == Active => onActive(),
            _ when this == Frozen => onFrozen(),
            _ when this == Revoked => onRevoked(),
            _ when this == Exhausted => onExhausted(),
            _ when this == Expired => onExpired(),
            _ => otherwise(Value)
        };

    public void Match(Action onDraft,
        Action onUnsigned,
        Action onActive,
        Action onFrozen,
        Action onRevoked,
        Action onExhausted,
        Action onExpired,
        Action<string> otherwise)
    {
        if (this == Draft) onDraft();
        else if (this == Unsigned) onUnsigned();
        else if (this == Active) onActive();
        else if (this == Frozen) onFrozen();
        else if (this == Revoked) onRevoked();
        else if (this == Exhausted) onExhausted();
        else if (this == Expired) onExpired();
        else otherwise(Value);
    }
}
