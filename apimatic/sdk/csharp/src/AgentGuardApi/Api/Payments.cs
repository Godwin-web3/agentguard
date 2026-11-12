using System;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using AgentGuardApi.Core;
using AgentGuardApi.Core.Exceptions;
using AgentGuardApi.Core.Models;
using AgentGuardApi.Core.Request;
using AgentGuardApi.Core.Response;
using AgentGuardApi.Errors;
using AgentGuardApi.Requests.Payments;

namespace AgentGuardApi.Api;

/// <summary>
/// Payment log and crash recovery
/// </summary>
public sealed class Payments
{
    private readonly RawClient _rawClient;
    private readonly Server _server;
    private readonly AuthSchemes _auth;

    internal Payments(RawClient rawClient, Server server, AuthSchemes auth)
    {
        _rawClient = rawClient;
        _server = server;
        _auth = auth;
    }

    /// <summary>
    /// List payments
    /// </summary>
    /// <param name="request">The operation's inputs</param>
    /// <param name="requestOptions">Per-request options, such as an overriding log level for this call</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>A <see cref="Task{TResult}"/> of <see cref="object"/> instance.</returns>
    /// <exception cref="ApiException{TError}"> of <see cref="ListPaymentsError"/> when the server returns an error response.</exception>
    /// <remarks>
    /// List payments
    /// </remarks>
    public Task<object> ListPayments(ListPaymentsRequest request,
        RequestOptions? requestOptions = null,
        CancellationToken cancellationToken = default) =>
        _rawClient.Execute(
            _server.Default("/v1/payments"),
            [],
            [new Param("limit", request.Limit)],
            [],
            HttpMethod.Get,
            EmptyBody.Instance,
            JsonResponse.Create<object>(),
            ListPaymentsError.Response,
            _auth.Admin,
            requestOptions,
            cancellationToken);

    /// <summary>
    /// List stuck payments
    /// </summary>
    /// <param name="request">The operation's inputs</param>
    /// <param name="requestOptions">Per-request options, such as an overriding log level for this call</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>A <see cref="Task{TResult}"/> of <see cref="object"/> instance.</returns>
    /// <exception cref="ApiException{TError}"> of <see cref="ListStuckPaymentsError"/> when the server returns an error response.</exception>
    /// <remarks>
    /// Payments in reserved/authorized older than a threshold
    /// </remarks>
    public Task<object> ListStuckPayments(ListStuckPaymentsRequest request,
        RequestOptions? requestOptions = null,
        CancellationToken cancellationToken = default) =>
        _rawClient.Execute(
            _server.Default("/v1/payments/stuck"),
            [],
            [new Param("older_than_ms", request.OlderThanMs)],
            [],
            HttpMethod.Get,
            EmptyBody.Instance,
            JsonResponse.Create<object>(),
            ListStuckPaymentsError.Response,
            _auth.Admin,
            requestOptions,
            cancellationToken);

    /// <summary>
    /// Recover payments
    /// </summary>
    /// <param name="request">The operation's inputs</param>
    /// <param name="requestOptions">Per-request options, such as an overriding log level for this call</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>A <see cref="Task{TResult}"/> of <see cref="object"/> instance.</returns>
    /// <exception cref="ApiException{TError}"> of <see cref="RecoverPaymentsError"/> when the server returns an error response.</exception>
    /// <remarks>
    /// Converge stuck payments with PayPal now
    /// </remarks>
    public Task<object> RecoverPayments(RecoverPaymentsRequest request,
        RequestOptions? requestOptions = null,
        CancellationToken cancellationToken = default) =>
        _rawClient.Execute(
            _server.Default("/v1/recover"),
            [],
            [],
            [new HeaderParam("Idempotency-Key", Guid.NewGuid())],
            HttpMethod.Post,
            JsonRequest.Create(request.Body),
            JsonResponse.Create<object>(),
            RecoverPaymentsError.Response,
            _auth.Admin,
            requestOptions,
            cancellationToken);
}
