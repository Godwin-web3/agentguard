using System;
using System.Diagnostics.CodeAnalysis;
using System.Threading.Tasks;
using AgentGuardApi.Core.ErrorResponse;
using AgentGuardApi.Core.Models;
using AgentGuardApi.Models;

namespace AgentGuardApi.Errors;

public sealed class ProposePaymentError : ApiError
{
    private readonly Optional<ErrorResponseModel> _errorResponseModelValue;

    private ProposePaymentError(Optional<ErrorResponseModel> errorResponseModelValue,
        Optional<RawError> fallback) : base(fallback)
    {
        _errorResponseModelValue = errorResponseModelValue;
    }

    private static ProposePaymentError AsErrorResponseModel(ErrorResponseModel value) =>
        new(Optional<ErrorResponseModel>.Some(value), default);

    private static ProposePaymentError AsFallback(RawError value) => new(default, Optional<RawError>.Some(value));

    public bool TryGetErrorResponseModel([NotNullWhen(true)] out ErrorResponseModel? value) =>
        _errorResponseModelValue.TryGetValue(out value);

    public TResult Match<TResult>(Func<ErrorResponseModel, TResult> onErrorResponseModel,
        Func<RawError, TResult> otherwise) =>
        this switch
        {
            _ when TryGetErrorResponseModel(out var errorResponseModelValue) => onErrorResponseModel(
                errorResponseModelValue),
            _ when TryGetRawError(out var fallback) => otherwise(fallback),
            _ => throw new InvalidOperationException($"{nameof(ProposePaymentError)} holds no value.")
        };

    public void Match(Action<ErrorResponseModel> onErrorResponseModel, Action<RawError> otherwise)
    {
        if (TryGetErrorResponseModel(out var errorResponseModelValue)) onErrorResponseModel(errorResponseModelValue);
        else if (TryGetRawError(out var fallback)) otherwise(fallback);
        else throw new InvalidOperationException($"{nameof(ProposePaymentError)} holds no value.");
    }

    private static Task<ProposePaymentError> Create(FailedResponse response) =>
        response.StatusCode switch
        {
            400 or 401 or 404 or 413 or 429 or 500 or 503 => response.Json<ErrorResponseModel>().As(
                AsErrorResponseModel),
            _ => response.RawBody().As(AsFallback)
        };

    internal static ApiErrorResponse<ProposePaymentError> Response { get; } = new(Create);
}
