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

namespace AgentGuardApi.Api;

/// <summary>
/// Scheduled jobs (Bearer CRON_SECRET)
/// </summary>
public sealed class Jobs
{
    private readonly RawClient _rawClient;
    private readonly Server _server;
    private readonly AuthSchemes _auth;

    internal Jobs(RawClient rawClient, Server server, AuthSchemes auth)
    {
        _rawClient = rawClient;
        _server = server;
        _auth = auth;
    }

    /// <summary>
    /// Run anchor job
    /// </summary>
    /// <param name="requestOptions">Per-request options, such as an overriding log level for this call</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>A <see cref="Task{TResult}"/> of <see cref="object"/> instance.</returns>
    /// <exception cref="ApiException{TError}"> of <see cref="RunAnchorJobError"/> when the server returns an error response.</exception>
    /// <remarks>
    /// Timestamp pending receipts and anchor the audit head (Bearer CRON_SECRET)
    /// </remarks>
    public Task<object> RunAnchorJob(RequestOptions? requestOptions = null,
        CancellationToken cancellationToken = default) =>
        _rawClient.Execute(
            _server.Default("/api/cron/anchor"),
            [],
            [],
            [],
            HttpMethod.Get,
            EmptyBody.Instance,
            JsonResponse.Create<object>(),
            RunAnchorJobError.Response,
            _auth.Cron,
            requestOptions,
            cancellationToken);

    /// <summary>
    /// Run anchor job post
    /// </summary>
    /// <param name="requestOptions">Per-request options, such as an overriding log level for this call</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>A <see cref="Task{TResult}"/> of <see cref="object"/> instance.</returns>
    /// <exception cref="ApiException{TError}"> of <see cref="RunAnchorJobPostError"/> when the server returns an error response.</exception>
    /// <remarks>
    /// Same as GET, for pg_net callers
    /// </remarks>
    public Task<object> RunAnchorJobPost(RequestOptions? requestOptions = null,
        CancellationToken cancellationToken = default) =>
        _rawClient.Execute(
            _server.Default("/api/cron/anchor"),
            [],
            [],
            [new HeaderParam("Idempotency-Key", Guid.NewGuid())],
            HttpMethod.Post,
            EmptyBody.Instance,
            JsonResponse.Create<object>(),
            RunAnchorJobPostError.Response,
            _auth.Cron,
            requestOptions,
            cancellationToken);

    /// <summary>
    /// Run maintenance job
    /// </summary>
    /// <param name="requestOptions">Per-request options, such as an overriding log level for this call</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>A <see cref="Task{TResult}"/> of <see cref="object"/> instance.</returns>
    /// <exception cref="ApiException{TError}"> of <see cref="RunMaintenanceJobError"/> when the server returns an error response.</exception>
    /// <remarks>
    /// Expire recovery locks, retry notifications, converge stuck payments
    /// </remarks>
    public Task<object> RunMaintenanceJob(RequestOptions? requestOptions = null,
        CancellationToken cancellationToken = default) =>
        _rawClient.Execute(
            _server.Default("/api/cron/maintenance"),
            [],
            [],
            [],
            HttpMethod.Get,
            EmptyBody.Instance,
            JsonResponse.Create<object>(),
            RunMaintenanceJobError.Response,
            _auth.Cron,
            requestOptions,
            cancellationToken);

    /// <summary>
    /// Run maintenance job post
    /// </summary>
    /// <param name="requestOptions">Per-request options, such as an overriding log level for this call</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>A <see cref="Task{TResult}"/> of <see cref="object"/> instance.</returns>
    /// <exception cref="ApiException{TError}"> of <see cref="RunMaintenanceJobPostError"/> when the server returns an error response.</exception>
    /// <remarks>
    /// Same as GET, for pg_net callers
    /// </remarks>
    public Task<object> RunMaintenanceJobPost(RequestOptions? requestOptions = null,
        CancellationToken cancellationToken = default) =>
        _rawClient.Execute(
            _server.Default("/api/cron/maintenance"),
            [],
            [],
            [new HeaderParam("Idempotency-Key", Guid.NewGuid())],
            HttpMethod.Post,
            EmptyBody.Instance,
            JsonResponse.Create<object>(),
            RunMaintenanceJobPostError.Response,
            _auth.Cron,
            requestOptions,
            cancellationToken);
}
