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
using AgentGuardApi.Requests.Mandates;

namespace AgentGuardApi.Api;

/// <summary>
/// Spending mandates the user signs with a passkey
/// </summary>
public sealed class Mandates
{
    private readonly RawClient _rawClient;
    private readonly Server _server;
    private readonly AuthSchemes _auth;

    internal Mandates(RawClient rawClient, Server server, AuthSchemes auth)
    {
        _rawClient = rawClient;
        _server = server;
        _auth = auth;
    }

    /// <summary>
    /// Confirm mandate
    /// </summary>
    /// <param name="request">The operation's inputs</param>
    /// <param name="requestOptions">Per-request options, such as an overriding log level for this call</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>A <see cref="Task{TResult}"/> of <see cref="object"/> instance.</returns>
    /// <exception cref="ApiException{TError}"> of <see cref="ConfirmMandateError"/> when the server returns an error response.</exception>
    /// <remarks>
    /// Activate a mandate with the user's passkey assertion
    /// </remarks>
    public Task<object> ConfirmMandate(ConfirmMandateRequest request,
        RequestOptions? requestOptions = null,
        CancellationToken cancellationToken = default) =>
        _rawClient.Execute(
            _server.Default("/v1/mandates/{id}/confirm"),
            [new TemplateParam("id", request.Id)],
            [],
            [new HeaderParam("Idempotency-Key", Guid.NewGuid())],
            HttpMethod.Post,
            JsonRequest.Create(request.Body),
            JsonResponse.Create<object>(),
            ConfirmMandateError.Response,
            _auth.Admin,
            requestOptions,
            cancellationToken);

    /// <summary>
    /// Create mandate
    /// </summary>
    /// <param name="request">The operation's inputs</param>
    /// <param name="requestOptions">Per-request options, such as an overriding log level for this call</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>A <see cref="Task{TResult}"/> of <see cref="object"/> instance.</returns>
    /// <exception cref="ApiException{TError}"> of <see cref="CreateMandateError"/> when the server returns an error response.</exception>
    /// <remarks>
    /// Create a draft mandate from structured constraints
    /// </remarks>
    public Task<object> CreateMandate(CreateMandateRequest request,
        RequestOptions? requestOptions = null,
        CancellationToken cancellationToken = default) =>
        _rawClient.Execute(
            _server.Default("/v1/mandates"),
            [],
            [],
            [new HeaderParam("Idempotency-Key", Guid.NewGuid())],
            HttpMethod.Post,
            JsonRequest.Create(request.Body),
            JsonResponse.Create<object>(),
            CreateMandateError.Response,
            _auth.Admin,
            requestOptions,
            cancellationToken);

    /// <summary>
    /// Draft mandate from text
    /// </summary>
    /// <param name="request">The operation's inputs</param>
    /// <param name="requestOptions">Per-request options, such as an overriding log level for this call</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>A <see cref="Task{TResult}"/> of <see cref="object"/> instance.</returns>
    /// <exception cref="ApiException{TError}"> of <see cref="DraftMandateFromTextError"/> when the server returns an error response.</exception>
    /// <remarks>
    /// Draft a mandate from plain English (model proposes, deterministic parser bounds it)
    /// </remarks>
    public Task<object> DraftMandateFromText(DraftMandateFromTextRequest request,
        RequestOptions? requestOptions = null,
        CancellationToken cancellationToken = default) =>
        _rawClient.Execute(
            _server.Default("/v1/mandates/draft-from-text"),
            [],
            [],
            [new HeaderParam("Idempotency-Key", Guid.NewGuid())],
            HttpMethod.Post,
            JsonRequest.Create(request.Body),
            JsonResponse.Create<object>(),
            DraftMandateFromTextError.Response,
            _auth.Admin,
            requestOptions,
            cancellationToken);

    /// <summary>
    /// Get mandate
    /// </summary>
    /// <param name="request">The operation's inputs</param>
    /// <param name="requestOptions">Per-request options, such as an overriding log level for this call</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>A <see cref="Task{TResult}"/> of <see cref="object"/> instance.</returns>
    /// <exception cref="ApiException{TError}"> of <see cref="GetMandateError"/> when the server returns an error response.</exception>
    /// <remarks>
    /// Mandate, status and spend
    /// </remarks>
    public Task<object> GetMandate(GetMandateRequest request,
        RequestOptions? requestOptions = null,
        CancellationToken cancellationToken = default) =>
        _rawClient.Execute(
            _server.Default("/v1/mandates/{id}"),
            [new TemplateParam("id", request.Id)],
            [],
            [],
            HttpMethod.Get,
            EmptyBody.Instance,
            JsonResponse.Create<object>(),
            GetMandateError.Response,
            _auth.Admin,
            requestOptions,
            cancellationToken);

    /// <summary>
    /// Get mandate revocation options
    /// </summary>
    /// <param name="request">The operation's inputs</param>
    /// <param name="requestOptions">Per-request options, such as an overriding log level for this call</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>A <see cref="Task{TResult}"/> of <see cref="object"/> instance.</returns>
    /// <exception cref="ApiException{TError}"> of <see cref="GetMandateRevocationOptionsError"/> when the server returns an error response.</exception>
    /// <remarks>
    /// Get WebAuthn options for revocation
    /// </remarks>
    public Task<object> GetMandateRevocationOptions(GetMandateRevocationOptionsRequest request,
        RequestOptions? requestOptions = null,
        CancellationToken cancellationToken = default) =>
        _rawClient.Execute(
            _server.Default("/v1/mandates/{id}/revoke-request"),
            [new TemplateParam("id", request.Id)],
            [],
            [new HeaderParam("Idempotency-Key", Guid.NewGuid())],
            HttpMethod.Post,
            EmptyBody.Instance,
            JsonResponse.Create<object>(),
            GetMandateRevocationOptionsError.Response,
            _auth.Admin,
            requestOptions,
            cancellationToken);

    /// <summary>
    /// Get mandate signing options
    /// </summary>
    /// <param name="request">The operation's inputs</param>
    /// <param name="requestOptions">Per-request options, such as an overriding log level for this call</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>A <see cref="Task{TResult}"/> of <see cref="object"/> instance.</returns>
    /// <exception cref="ApiException{TError}"> of <see cref="GetMandateSigningOptionsError"/> when the server returns an error response.</exception>
    /// <remarks>
    /// Get WebAuthn options whose challenge is the mandate hash
    /// </remarks>
    public Task<object> GetMandateSigningOptions(GetMandateSigningOptionsRequest request,
        RequestOptions? requestOptions = null,
        CancellationToken cancellationToken = default) =>
        _rawClient.Execute(
            _server.Default("/v1/mandates/{id}/sign-request"),
            [new TemplateParam("id", request.Id)],
            [],
            [new HeaderParam("Idempotency-Key", Guid.NewGuid())],
            HttpMethod.Post,
            EmptyBody.Instance,
            JsonResponse.Create<object>(),
            GetMandateSigningOptionsError.Response,
            _auth.Admin,
            requestOptions,
            cancellationToken);

    /// <summary>
    /// List mandates
    /// </summary>
    /// <param name="requestOptions">Per-request options, such as an overriding log level for this call</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>A <see cref="Task{TResult}"/> of <see cref="object"/> instance.</returns>
    /// <exception cref="ApiException{TError}"> of <see cref="ListMandatesError"/> when the server returns an error response.</exception>
    /// <remarks>
    /// List mandates with spend state and summary
    /// </remarks>
    public Task<object> ListMandates(RequestOptions? requestOptions = null,
        CancellationToken cancellationToken = default) =>
        _rawClient.Execute(
            _server.Default("/v1/mandates"),
            [],
            [],
            [],
            HttpMethod.Get,
            EmptyBody.Instance,
            JsonResponse.Create<object>(),
            ListMandatesError.Response,
            _auth.Admin,
            requestOptions,
            cancellationToken);

    /// <summary>
    /// Revoke mandate
    /// </summary>
    /// <param name="request">The operation's inputs</param>
    /// <param name="requestOptions">Per-request options, such as an overriding log level for this call</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>A <see cref="Task{TResult}"/> of <see cref="object"/> instance.</returns>
    /// <exception cref="ApiException{TError}"> of <see cref="RevokeMandateError"/> when the server returns an error response.</exception>
    /// <remarks>
    /// Revoke with the user's passkey (drafts can be discarded without one)
    /// </remarks>
    public Task<object> RevokeMandate(RevokeMandateRequest request,
        RequestOptions? requestOptions = null,
        CancellationToken cancellationToken = default) =>
        _rawClient.Execute(
            _server.Default("/v1/mandates/{id}/revoke"),
            [new TemplateParam("id", request.Id)],
            [],
            [new HeaderParam("Idempotency-Key", Guid.NewGuid())],
            HttpMethod.Post,
            JsonRequest.Create(request.Body),
            JsonResponse.Create<object>(),
            RevokeMandateError.Response,
            _auth.Admin,
            requestOptions,
            cancellationToken);
}
