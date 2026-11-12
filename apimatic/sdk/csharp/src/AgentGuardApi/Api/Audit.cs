using System;
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
using AgentGuardApi.Requests.Audit;

namespace AgentGuardApi.Api;

/// <summary>
/// Hash-chained audit ledger, attestations and anchors
/// </summary>
public sealed class Audit
{
    private readonly RawClient _rawClient;
    private readonly Server _server;
    private readonly AuthSchemes _auth;

    internal Audit(RawClient rawClient, Server server, AuthSchemes auth)
    {
        _rawClient = rawClient;
        _server = server;
        _auth = auth;
    }

    /// <summary>
    /// Anchor audit chain
    /// </summary>
    /// <param name="requestOptions">Per-request options, such as an overriding log level for this call</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>A <see cref="Task{TResult}"/> of <see cref="object"/> instance.</returns>
    /// <exception cref="ApiException{TError}"> of <see cref="AnchorAuditChainError"/> when the server returns an error response.</exception>
    /// <remarks>
    /// Anchor the chain head now (RFC 6962 Merkle root, RFC 3161 stamped)
    /// </remarks>
    public Task<object> AnchorAuditChain(RequestOptions? requestOptions = null,
        CancellationToken cancellationToken = default) =>
        _rawClient.Execute(
            _server.Default("/v1/audit/anchor"),
            [],
            [],
            [new HeaderParam("Idempotency-Key", Guid.NewGuid())],
            HttpMethod.Post,
            EmptyBody.Instance,
            JsonResponse.Create<object>(),
            AnchorAuditChainError.Response,
            _auth.Admin,
            requestOptions,
            cancellationToken);

    /// <summary>
    /// Get audit attestation
    /// </summary>
    /// <param name="requestOptions">Per-request options, such as an overriding log level for this call</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>A <see cref="Task{TResult}"/> of <see cref="object"/> instance.</returns>
    /// <exception cref="ApiException{TError}"> of <see cref="GetAuditAttestationError"/> when the server returns an error response.</exception>
    /// <remarks>
    /// Chain head signed with the active issuer key
    /// </remarks>
    public Task<object> GetAuditAttestation(RequestOptions? requestOptions = null,
        CancellationToken cancellationToken = default) =>
        _rawClient.Execute(
            _server.Default("/v1/audit/attestation"),
            [],
            [],
            [],
            HttpMethod.Get,
            EmptyBody.Instance,
            JsonResponse.Create<object>(),
            GetAuditAttestationError.Response,
            _auth.Admin,
            requestOptions,
            cancellationToken);

    /// <summary>
    /// List audit anchors
    /// </summary>
    /// <param name="request">The operation's inputs</param>
    /// <param name="requestOptions">Per-request options, such as an overriding log level for this call</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>A <see cref="Task{TResult}"/> of <see cref="object"/> instance.</returns>
    /// <exception cref="ApiException{TError}"> of <see cref="ListAuditAnchorsError"/> when the server returns an error response.</exception>
    /// <remarks>
    /// Published anchors; keep copies to detect forks
    /// </remarks>
    public Task<object> ListAuditAnchors(ListAuditAnchorsRequest request,
        RequestOptions? requestOptions = null,
        CancellationToken cancellationToken = default) =>
        _rawClient.Execute(
            _server.Default("/v1/audit/anchors"),
            [],
            [new Param("limit", request.Limit)],
            [],
            HttpMethod.Get,
            EmptyBody.Instance,
            JsonResponse.Create<object>(),
            ListAuditAnchorsError.Response,
            AuthScheme.None,
            requestOptions,
            cancellationToken);

    /// <summary>
    /// List audit entries
    /// </summary>
    /// <param name="request">The operation's inputs</param>
    /// <param name="requestOptions">Per-request options, such as an overriding log level for this call</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>A <see cref="Task{TResult}"/> of <see cref="IReadOnlyList{T}"/> of <see cref="AuditEntry"/> instance.</returns>
    /// <exception cref="ApiException{TError}"> of <see cref="ListAuditEntriesError"/> when the server returns an error response.</exception>
    /// <remarks>
    /// Hash-chained audit log
    /// </remarks>
    public Task<IReadOnlyList<AuditEntry>> ListAuditEntries(ListAuditEntriesRequest request,
        RequestOptions? requestOptions = null,
        CancellationToken cancellationToken = default) =>
        _rawClient.Execute(
            _server.Default("/v1/audit"),
            [],
            [new Param("limit", request.Limit)],
            [],
            HttpMethod.Get,
            EmptyBody.Instance,
            JsonResponse.Create<IReadOnlyList<AuditEntry>>(),
            ListAuditEntriesError.Response,
            _auth.Admin,
            requestOptions,
            cancellationToken);

    /// <summary>
    /// Verify audit chain
    /// </summary>
    /// <param name="requestOptions">Per-request options, such as an overriding log level for this call</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>A <see cref="Task{TResult}"/> of <see cref="AuditVerification"/> instance.</returns>
    /// <exception cref="ApiException{TError}"> of <see cref="VerifyAuditChainError"/> when the server returns an error response.</exception>
    /// <remarks>
    /// Recompute and verify the whole chain
    /// </remarks>
    public Task<AuditVerification> VerifyAuditChain(RequestOptions? requestOptions = null,
        CancellationToken cancellationToken = default) =>
        _rawClient.Execute(
            _server.Default("/v1/audit/verify"),
            [],
            [],
            [],
            HttpMethod.Get,
            EmptyBody.Instance,
            JsonResponse.Create<AuditVerification>(),
            VerifyAuditChainError.Response,
            _auth.Admin,
            requestOptions,
            cancellationToken);
}
