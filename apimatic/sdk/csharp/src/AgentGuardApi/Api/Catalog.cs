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
using AgentGuardApi.Requests.Catalog;

namespace AgentGuardApi.Api;

/// <summary>
/// Channel3 product search for the owner
/// </summary>
public sealed class Catalog
{
    private readonly RawClient _rawClient;
    private readonly Server _server;
    private readonly AuthSchemes _auth;

    internal Catalog(RawClient rawClient, Server server, AuthSchemes auth)
    {
        _rawClient = rawClient;
        _server = server;
        _auth = auth;
    }

    /// <summary>
    /// Get product search status
    /// </summary>
    /// <param name="requestOptions">Per-request options, such as an overriding log level for this call</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>A <see cref="Task{TResult}"/> of <see cref="object"/> instance.</returns>
    /// <exception cref="ApiException{TError}"> of <see cref="GetProductSearchStatusError"/> when the server returns an error response.</exception>
    /// <remarks>
    /// Whether Channel3 product search is configured (CHANNEL3_API_KEY)
    /// </remarks>
    public Task<object> GetProductSearchStatus(RequestOptions? requestOptions = null,
        CancellationToken cancellationToken = default) =>
        _rawClient.Execute(
            _server.Default("/v1/products/status"),
            [],
            [],
            [],
            HttpMethod.Get,
            EmptyBody.Instance,
            JsonResponse.Create<object>(),
            GetProductSearchStatusError.Response,
            _auth.Admin,
            requestOptions,
            cancellationToken);

    /// <summary>
    /// Search products for mandate
    /// </summary>
    /// <param name="request">The operation's inputs</param>
    /// <param name="requestOptions">Per-request options, such as an overriding log level for this call</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>A <see cref="Task{TResult}"/> of <see cref="ProductSearchResult"/> instance.</returns>
    /// <exception cref="ApiException{TError}"> of <see cref="SearchProductsForMandateError"/> when the server returns an error response.</exception>
    /// <remarks>
    /// Owner view of the same Channel3 search, with an advisory mandate-fit check per product
    /// </remarks>
    public Task<ProductSearchResult> SearchProductsForMandate(SearchProductsForMandateRequest request,
        RequestOptions? requestOptions = null,
        CancellationToken cancellationToken = default) =>
        _rawClient.Execute(
            _server.Default("/v1/products/search"),
            [],
            [],
            [new HeaderParam("Idempotency-Key", Guid.NewGuid())],
            HttpMethod.Post,
            JsonRequest.Create(request.Body),
            JsonResponse.Create<ProductSearchResult>(),
            SearchProductsForMandateError.Response,
            _auth.Admin,
            requestOptions,
            cancellationToken);
}
