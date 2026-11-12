using System.Collections.Generic;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using AgentGuardApi.Core;
using AgentGuardApi.Core.Authentication;
using AgentGuardApi.Core.Exceptions;
using AgentGuardApi.Core.Models;
using AgentGuardApi.Core.Request;
using AgentGuardApi.Core.Response;
using AgentGuardApi.Errors;
using AgentGuardApi.Models;
using AgentGuardApi.Requests.Receipts;

namespace AgentGuardApi.Api;

/// <summary>
/// Signed Proof-of-Intent receipts for captured payments
/// </summary>
public sealed class Receipts
{
    private readonly RawClient _rawClient;
    private readonly Server _server;
    private readonly AuthSchemes _auth;

    internal Receipts(RawClient rawClient, Server server, AuthSchemes auth)
    {
        _rawClient = rawClient;
        _server = server;
        _auth = auth;
    }

    /// <summary>
    /// Get payment receipt
    /// </summary>
    /// <param name="request">The operation's inputs</param>
    /// <param name="requestOptions">Per-request options, such as an overriding log level for this call</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>A <see cref="Task{TResult}"/> of <see cref="ReceiptEnvelope"/> instance.</returns>
    /// <exception cref="ApiException{TError}"> of <see cref="GetPaymentReceiptError"/> when the server returns an error response.</exception>
    /// <remarks>
    /// Receipt for a payment
    /// </remarks>
    public Task<ReceiptEnvelope> GetPaymentReceipt(GetPaymentReceiptRequest request,
        RequestOptions? requestOptions = null,
        CancellationToken cancellationToken = default) =>
        _rawClient.Execute(
            _server.Default("/v1/payments/{id}/receipt"),
            [new TemplateParam("id", request.Id)],
            [],
            [],
            HttpMethod.Get,
            EmptyBody.Instance,
            JsonResponse.Create<ReceiptEnvelope>(),
            GetPaymentReceiptError.Response,
            _auth.Admin,
            requestOptions,
            cancellationToken);

    /// <summary>
    /// Get public receipt
    /// </summary>
    /// <param name="request">The operation's inputs</param>
    /// <param name="requestOptions">Per-request options, such as an overriding log level for this call</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>A <see cref="Task{TResult}"/> of <see cref="ReceiptEnvelope"/> instance.</returns>
    /// <exception cref="ApiException{TError}"> of <see cref="GetPublicReceiptError"/> when the server returns an error response.</exception>
    /// <remarks>
    /// Public receipt lookup (only when AGENTGUARD_PUBLIC_RECEIPTS=1)
    /// </remarks>
    public Task<ReceiptEnvelope> GetPublicReceipt(GetPublicReceiptRequest request,
        RequestOptions? requestOptions = null,
        CancellationToken cancellationToken = default) =>
        _rawClient.Execute(
            _server.Default("/v1/public/receipts/{id}"),
            [new TemplateParam("id", request.Id)],
            [],
            [],
            HttpMethod.Get,
            EmptyBody.Instance,
            JsonResponse.Create<ReceiptEnvelope>(),
            GetPublicReceiptError.Response,
            AuthScheme.None,
            requestOptions,
            cancellationToken);

    /// <summary>
    /// Get receipt
    /// </summary>
    /// <param name="request">The operation's inputs</param>
    /// <param name="requestOptions">Per-request options, such as an overriding log level for this call</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>A <see cref="Task{TResult}"/> of <see cref="ReceiptEnvelope"/> instance.</returns>
    /// <exception cref="ApiException{TError}"> of <see cref="GetReceiptError"/> when the server returns an error response.</exception>
    /// <remarks>
    /// Receipt by id
    /// </remarks>
    public Task<ReceiptEnvelope> GetReceipt(GetReceiptRequest request,
        RequestOptions? requestOptions = null,
        CancellationToken cancellationToken = default) =>
        _rawClient.Execute(
            _server.Default("/v1/receipts/{id}"),
            [new TemplateParam("id", request.Id)],
            [],
            [],
            HttpMethod.Get,
            EmptyBody.Instance,
            JsonResponse.Create<ReceiptEnvelope>(),
            GetReceiptError.Response,
            _auth.Admin,
            requestOptions,
            cancellationToken);

    /// <summary>
    /// List receipts
    /// </summary>
    /// <param name="request">The operation's inputs</param>
    /// <param name="requestOptions">Per-request options, such as an overriding log level for this call</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>A <see cref="Task{TResult}"/> of <see cref="IReadOnlyList{T}"/> of <see cref="ReceiptSummary"/> instance.</returns>
    /// <exception cref="ApiException{TError}"> of <see cref="ListReceiptsError"/> when the server returns an error response.</exception>
    /// <remarks>
    /// List receipts
    /// </remarks>
    public Task<IReadOnlyList<ReceiptSummary>> ListReceipts(ListReceiptsRequest request,
        RequestOptions? requestOptions = null,
        CancellationToken cancellationToken = default) =>
        _rawClient.Execute(
            _server.Default("/v1/receipts"),
            [],
            [new Param("limit", request.Limit)],
            [],
            HttpMethod.Get,
            EmptyBody.Instance,
            JsonResponse.Create<IReadOnlyList<ReceiptSummary>>(),
            ListReceiptsError.Response,
            _auth.Admin,
            requestOptions,
            cancellationToken);
}
