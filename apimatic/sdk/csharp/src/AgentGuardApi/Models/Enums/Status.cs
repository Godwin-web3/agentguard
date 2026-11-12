using System;
using System.Text.Json.Serialization;
using AgentGuardApi.Core.Enum;

namespace AgentGuardApi.Models.Enums;

[JsonConverter(typeof(StringEnumConverter<Status>))]
public sealed record Status : OpenStringEnum<Status>
{
    private Status(string value) : base(value)
    {
    }

    public static readonly Status Rejected = new("rejected");

    public static readonly Status NeedsHuman = new("needs_human");

    public static readonly Status Reserved = new("reserved");

    public static readonly Status Authorized = new("authorized");

    public static readonly Status Captured = new("captured");

    public static readonly Status Voided = new("voided");

    public static readonly Status Failed = new("failed");

    public TResult Match<TResult>(Func<TResult> onRejected,
        Func<TResult> onNeedsHuman,
        Func<TResult> onReserved,
        Func<TResult> onAuthorized,
        Func<TResult> onCaptured,
        Func<TResult> onVoided,
        Func<TResult> onFailed,
        Func<string, TResult> otherwise) =>
        this switch
        {
            _ when this == Rejected => onRejected(),
            _ when this == NeedsHuman => onNeedsHuman(),
            _ when this == Reserved => onReserved(),
            _ when this == Authorized => onAuthorized(),
            _ when this == Captured => onCaptured(),
            _ when this == Voided => onVoided(),
            _ when this == Failed => onFailed(),
            _ => otherwise(Value)
        };

    public void Match(Action onRejected,
        Action onNeedsHuman,
        Action onReserved,
        Action onAuthorized,
        Action onCaptured,
        Action onVoided,
        Action onFailed,
        Action<string> otherwise)
    {
        if (this == Rejected) onRejected();
        else if (this == NeedsHuman) onNeedsHuman();
        else if (this == Reserved) onReserved();
        else if (this == Authorized) onAuthorized();
        else if (this == Captured) onCaptured();
        else if (this == Voided) onVoided();
        else if (this == Failed) onFailed();
        else otherwise(Value);
    }
}
