using System;
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
using AgentGuardApi.Requests.Keys;

namespace AgentGuardApi.Api;

/// <summary>
/// Issuer signing keys: publish, rotate, mark compromised
/// </summary>
public sealed class Keys
{
    private readonly RawClient _rawClient;
    private readonly Server _server;
    private readonly AuthSchemes _auth;

    internal Keys(RawClient rawClient, Server server, AuthSchemes auth)
    {
        _rawClient = rawClient;
        _server = server;
        _auth = auth;
    }

    /// <summary>
    /// Get issuer key
    /// </summary>
    /// <param name="requestOptions">Per-request options, such as an overriding log level for this call</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>A <see cref="Task{TResult}"/> of <see cref="object"/> instance.</returns>
    /// <exception cref="ApiException{TError}"> of <see cref="GetIssuerKeyError"/> when the server returns an error response.</exception>
    /// <remarks>
    /// Active issuer public key (legacy single-key form)
    /// </remarks>
    public Task<object> GetIssuerKey(RequestOptions? requestOptions = null,
        CancellationToken cancellationToken = default) =>
        _rawClient.Execute(
            _server.Default("/.well-known/agentguard-key"),
            [],
            [],
            [],
            HttpMethod.Get,
            EmptyBody.Instance,
            JsonResponse.Create<object>(),
            GetIssuerKeyError.Response,
            AuthScheme.None,
            requestOptions,
            cancellationToken);

    /// <summary>
    /// Get issuer key set
    /// </summary>
    /// <param name="requestOptions">Per-request options, such as an overriding log level for this call</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>A <see cref="Task{TResult}"/> of <see cref="IssuerKeySet"/> instance.</returns>
    /// <exception cref="ApiException{TError}"> of <see cref="GetIssuerKeySetError"/> when the server returns an error response.</exception>
    /// <remarks>
    /// Issuer key set: every key with kid, status, created_at, retired_at, compromised_at. Pin this.
    /// </remarks>
    public Task<IssuerKeySet> GetIssuerKeySet(RequestOptions? requestOptions = null,
        CancellationToken cancellationToken = default) =>
        _rawClient.Execute(
            _server.Default("/.well-known/agentguard-keys"),
            [],
            [],
            [],
            HttpMethod.Get,
            EmptyBody.Instance,
            JsonResponse.Create<IssuerKeySet>(),
            GetIssuerKeySetError.Response,
            AuthScheme.None,
            requestOptions,
            cancellationToken);

    /// <summary>
    /// Mark key compromised
    /// </summary>
    /// <param name="request">The operation's inputs</param>
    /// <param name="requestOptions">Per-request options, such as an overriding log level for this call</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>A <see cref="Task{TResult}"/> of <see cref="object"/> instance.</returns>
    /// <exception cref="ApiException{TError}"> of <see cref="MarkKeyCompromisedError"/> when the server returns an error response.</exception>
    /// <remarks>
    /// Mark a key compromised as of <c>at</c> (rotates first if active)
    /// </remarks>
    public Task<object> MarkKeyCompromised(MarkKeyCompromisedRequest request,
        RequestOptions? requestOptions = null,
        CancellationToken cancellationToken = default) =>
        _rawClient.Execute(
            _server.Default("/v1/keys/{kid}/compromised"),
            [new TemplateParam("kid", request.Kid)],
            [],
            [new HeaderParam("Idempotency-Key", Guid.NewGuid())],
            HttpMethod.Post,
            JsonRequest.Create(request.Body),
            JsonResponse.Create<object>(),
            MarkKeyCompromisedError.Response,
            _auth.Admin,
            requestOptions,
            cancellationToken);

    /// <summary>
    /// Rotate issuer key
    /// </summary>
    /// <param name="requestOptions">Per-request options, such as an overriding log level for this call</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>A <see cref="Task{TResult}"/> of <see cref="object"/> instance.</returns>
    /// <exception cref="ApiException{TError}"> of <see cref="RotateIssuerKeyError"/> when the server returns an error response.</exception>
    /// <remarks>
    /// Retire the active issuer key and create a new one (audited)
    /// </remarks>
    public Task<object> RotateIssuerKey(RequestOptions? requestOptions = null,
        CancellationToken cancellationToken = default) =>
        _rawClient.Execute(
            _server.Default("/v1/keys/rotate"),
            [],
            [],
            [new HeaderParam("Idempotency-Key", Guid.NewGuid())],
            HttpMethod.Post,
            EmptyBody.Instance,
            JsonResponse.Create<object>(),
            RotateIssuerKeyError.Response,
            _auth.Admin,
            requestOptions,
            cancellationToken);
}
