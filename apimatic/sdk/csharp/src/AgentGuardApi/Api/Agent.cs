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
using AgentGuardApi.Models;
using AgentGuardApi.Requests.Agent;

namespace AgentGuardApi.Api;

/// <summary>
/// Calls an agent makes with its own key: product search, payments, receipts
/// </summary>
public sealed class Agent
{
    private readonly RawClient _rawClient;
    private readonly Server _server;
    private readonly AuthSchemes _auth;

    internal Agent(RawClient rawClient, Server server, AuthSchemes auth)
    {
        _rawClient = rawClient;
        _server = server;
        _auth = auth;
    }

    /// <summary>
    /// Get agent mandate
    /// </summary>
    /// <param name="request">The operation's inputs</param>
    /// <param name="requestOptions">Per-request options, such as an overriding log level for this call</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>A <see cref="Task{TResult}"/> of <see cref="AgentMandate"/> instance.</returns>
    /// <exception cref="ApiException{TError}"> of <see cref="GetAgentMandateError"/> when the server returns an error response.</exception>
    /// <remarks>
    /// The agent's own mandate, status and spend
    /// </remarks>
    public Task<AgentMandate> GetAgentMandate(GetAgentMandateRequest request,
        RequestOptions? requestOptions = null,
        CancellationToken cancellationToken = default) =>
        _rawClient.Execute(
            _server.Default("/v1/agent/mandates/{id}"),
            [new TemplateParam("id", request.Id)],
            [],
            [],
            HttpMethod.Get,
            EmptyBody.Instance,
            JsonResponse.Create<AgentMandate>(),
            GetAgentMandateError.Response,
            _auth.Agent,
            requestOptions,
            cancellationToken);

    /// <summary>
    /// Get agent payment
    /// </summary>
    /// <param name="request">The operation's inputs</param>
    /// <param name="requestOptions">Per-request options, such as an overriding log level for this call</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>A <see cref="Task{TResult}"/> of <see cref="PaymentDecision"/> instance.</returns>
    /// <exception cref="ApiException{TError}"> of <see cref="GetAgentPaymentError"/> when the server returns an error response.</exception>
    /// <remarks>
    /// Payment status (the calling agent's own only)
    /// </remarks>
    public Task<PaymentDecision> GetAgentPayment(GetAgentPaymentRequest request,
        RequestOptions? requestOptions = null,
        CancellationToken cancellationToken = default) =>
        _rawClient.Execute(
            _server.Default("/v1/agent/payments/{id}"),
            [new TemplateParam("id", request.Id)],
            [],
            [],
            HttpMethod.Get,
            EmptyBody.Instance,
            JsonResponse.Create<PaymentDecision>(),
            GetAgentPaymentError.Response,
            _auth.Agent,
            requestOptions,
            cancellationToken);

    /// <summary>
    /// Get agent payment receipt
    /// </summary>
    /// <param name="request">The operation's inputs</param>
    /// <param name="requestOptions">Per-request options, such as an overriding log level for this call</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>A <see cref="Task{TResult}"/> of <see cref="ReceiptEnvelope"/> instance.</returns>
    /// <exception cref="ApiException{TError}"> of <see cref="GetAgentPaymentReceiptError"/> when the server returns an error response.</exception>
    /// <remarks>
    /// Proof-of-Intent receipt for a captured payment
    /// </remarks>
    public Task<ReceiptEnvelope> GetAgentPaymentReceipt(GetAgentPaymentReceiptRequest request,
        RequestOptions? requestOptions = null,
        CancellationToken cancellationToken = default) =>
        _rawClient.Execute(
            _server.Default("/v1/agent/payments/{id}/receipt"),
            [new TemplateParam("id", request.Id)],
            [],
            [],
            HttpMethod.Get,
            EmptyBody.Instance,
            JsonResponse.Create<ReceiptEnvelope>(),
            GetAgentPaymentReceiptError.Response,
            _auth.Agent,
            requestOptions,
            cancellationToken);

    /// <summary>
    /// Propose a payment
    /// </summary>
    /// <param name="request">The operation's inputs</param>
    /// <param name="requestOptions">Per-request options, such as an overriding log level for this call</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>A <see cref="Task{TResult}"/> of <see cref="PaymentDecision"/> instance.</returns>
    /// <exception cref="ApiException{TError}"> of <see cref="ProposePaymentError"/> when the server returns an error response.</exception>
    /// <remarks>
    /// Propose a payment (30/min per agent; 429 above)
    /// </remarks>
    public Task<PaymentDecision> ProposePayment(ProposePaymentRequest request,
        RequestOptions? requestOptions = null,
        CancellationToken cancellationToken = default) =>
        _rawClient.Execute(
            _server.Default("/v1/agent/payments"),
            [],
            [],
            [new HeaderParam("Idempotency-Key", Guid.NewGuid())],
            HttpMethod.Post,
            JsonRequest.Create(request.Body),
            JsonResponse.Create<PaymentDecision>(),
            ProposePaymentError.Response,
            _auth.Agent,
            requestOptions,
            cancellationToken);

    /// <summary>
    /// Search products
    /// </summary>
    /// <param name="request">The operation's inputs</param>
    /// <param name="requestOptions">Per-request options, such as an overriding log level for this call</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>A <see cref="Task{TResult}"/> of <see cref="ProductSearchResult"/> instance.</returns>
    /// <exception cref="ApiException{TError}"> of <see cref="SearchProductsError"/> when the server returns an error response.</exception>
    /// <remarks>
    /// Search the Channel3 product catalog within the mandate's currency and remaining budget (discovery only; never pays)
    /// </remarks>
    public Task<ProductSearchResult> SearchProducts(SearchProductsRequest request,
        RequestOptions? requestOptions = null,
        CancellationToken cancellationToken = default) =>
        _rawClient.Execute(
            _server.Default("/v1/agent/products/search"),
            [],
            [],
            [new HeaderParam("Idempotency-Key", Guid.NewGuid())],
            HttpMethod.Post,
            JsonRequest.Create(request.Body),
            JsonResponse.Create<ProductSearchResult>(),
            SearchProductsError.Response,
            _auth.Agent,
            requestOptions,
            cancellationToken);
}
