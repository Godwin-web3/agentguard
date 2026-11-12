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
using AgentGuardApi.Requests.Approvals;

namespace AgentGuardApi.Api;

/// <summary>
/// Payments held for the user's passkey approval
/// </summary>
public sealed class Approvals
{
    private readonly RawClient _rawClient;
    private readonly Server _server;
    private readonly AuthSchemes _auth;

    internal Approvals(RawClient rawClient, Server server, AuthSchemes auth)
    {
        _rawClient = rawClient;
        _server = server;
        _auth = auth;
    }

    /// <summary>
    /// Get approval options
    /// </summary>
    /// <param name="request">The operation's inputs</param>
    /// <param name="requestOptions">Per-request options, such as an overriding log level for this call</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>A <see cref="Task{TResult}"/> of <see cref="object"/> instance.</returns>
    /// <exception cref="ApiException{TError}"> of <see cref="GetApprovalOptionsError"/> when the server returns an error response.</exception>
    /// <remarks>
    /// Approval statement and WebAuthn options (5-minute nonce)
    /// </remarks>
    public Task<object> GetApprovalOptions(GetApprovalOptionsRequest request,
        RequestOptions? requestOptions = null,
        CancellationToken cancellationToken = default) =>
        _rawClient.Execute(
            _server.Default("/v1/approvals/{id}/request"),
            [new TemplateParam("id", request.Id)],
            [],
            [new HeaderParam("Idempotency-Key", Guid.NewGuid())],
            HttpMethod.Post,
            JsonRequest.Create(request.Body),
            JsonResponse.Create<object>(),
            GetApprovalOptionsError.Response,
            _auth.Admin,
            requestOptions,
            cancellationToken);

    /// <summary>
    /// List approvals
    /// </summary>
    /// <param name="requestOptions">Per-request options, such as an overriding log level for this call</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>A <see cref="Task{TResult}"/> of <see cref="object"/> instance.</returns>
    /// <exception cref="ApiException{TError}"> of <see cref="ListApprovalsError"/> when the server returns an error response.</exception>
    /// <remarks>
    /// Payments held for the owner
    /// </remarks>
    public Task<object> ListApprovals(RequestOptions? requestOptions = null,
        CancellationToken cancellationToken = default) =>
        _rawClient.Execute(
            _server.Default("/v1/approvals"),
            [],
            [],
            [],
            HttpMethod.Get,
            EmptyBody.Instance,
            JsonResponse.Create<object>(),
            ListApprovalsError.Response,
            _auth.Admin,
            requestOptions,
            cancellationToken);

    /// <summary>
    /// Resolve approval
    /// </summary>
    /// <param name="request">The operation's inputs</param>
    /// <param name="requestOptions">Per-request options, such as an overriding log level for this call</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>A <see cref="Task{TResult}"/> of <see cref="object"/> instance.</returns>
    /// <exception cref="ApiException{TError}"> of <see cref="ResolveApprovalError"/> when the server returns an error response.</exception>
    /// <remarks>
    /// Approve or deny with the user's passkey. The admin token alone is refused.
    /// </remarks>
    public Task<object> ResolveApproval(ResolveApprovalRequest request,
        RequestOptions? requestOptions = null,
        CancellationToken cancellationToken = default) =>
        _rawClient.Execute(
            _server.Default("/v1/approvals/{id}"),
            [new TemplateParam("id", request.Id)],
            [],
            [new HeaderParam("Idempotency-Key", Guid.NewGuid())],
            HttpMethod.Post,
            JsonRequest.Create(request.Body),
            JsonResponse.Create<object>(),
            ResolveApprovalError.Response,
            _auth.Admin,
            requestOptions,
            cancellationToken);
}
