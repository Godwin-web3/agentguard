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
using AgentGuardApi.Requests.Setup;

namespace AgentGuardApi.Api;

/// <summary>
/// Agents and PayPal wallet vaulting
/// </summary>
public sealed class Setup
{
    private readonly RawClient _rawClient;
    private readonly Server _server;
    private readonly AuthSchemes _auth;

    internal Setup(RawClient rawClient, Server server, AuthSchemes auth)
    {
        _rawClient = rawClient;
        _server = server;
        _auth = auth;
    }

    /// <summary>
    /// Complete wallet setup
    /// </summary>
    /// <param name="request">The operation's inputs</param>
    /// <param name="requestOptions">Per-request options, such as an overriding log level for this call</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>A <see cref="Task{TResult}"/> of <see cref="object"/> instance.</returns>
    /// <exception cref="ApiException{TError}"> of <see cref="CompleteWalletSetupError"/> when the server returns an error response.</exception>
    /// <remarks>
    /// PayPal redirect target after buyer consent; links the vaulted wallet
    /// </remarks>
    public Task<object> CompleteWalletSetup(CompleteWalletSetupRequest request,
        RequestOptions? requestOptions = null,
        CancellationToken cancellationToken = default) =>
        _rawClient.Execute(
            _server.Default("/v1/wallets/return"),
            [],
            [new Param("state", request.State), new Param("approval_token_id", request.ApprovalTokenId)],
            [],
            HttpMethod.Get,
            EmptyBody.Instance,
            JsonResponse.Create<object>(),
            CompleteWalletSetupError.Response,
            AuthScheme.None,
            requestOptions,
            cancellationToken);

    /// <summary>
    /// Link wallet
    /// </summary>
    /// <param name="request">The operation's inputs</param>
    /// <param name="requestOptions">Per-request options, such as an overriding log level for this call</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>A <see cref="Task{TResult}"/> of <see cref="object"/> instance.</returns>
    /// <exception cref="ApiException{TError}"> of <see cref="LinkWalletError"/> when the server returns an error response.</exception>
    /// <remarks>
    /// Link an existing PayPal vault id to a user
    /// </remarks>
    public Task<object> LinkWallet(LinkWalletRequest request,
        RequestOptions? requestOptions = null,
        CancellationToken cancellationToken = default) =>
        _rawClient.Execute(
            _server.Default("/v1/wallets/link"),
            [],
            [],
            [new HeaderParam("Idempotency-Key", Guid.NewGuid())],
            HttpMethod.Post,
            JsonRequest.Create(request.Body),
            JsonResponse.Create<object>(),
            LinkWalletError.Response,
            _auth.Admin,
            requestOptions,
            cancellationToken);

    /// <summary>
    /// Register agent
    /// </summary>
    /// <param name="request">The operation's inputs</param>
    /// <param name="requestOptions">Per-request options, such as an overriding log level for this call</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>A <see cref="Task{TResult}"/> of <see cref="AgentCredentials"/> instance.</returns>
    /// <exception cref="ApiException{TError}"> of <see cref="RegisterAgentError"/> when the server returns an error response.</exception>
    /// <remarks>
    /// Register an agent and return its API key (shown once)
    /// </remarks>
    public Task<AgentCredentials> RegisterAgent(RegisterAgentRequest request,
        RequestOptions? requestOptions = null,
        CancellationToken cancellationToken = default) =>
        _rawClient.Execute(
            _server.Default("/v1/agents"),
            [],
            [],
            [new HeaderParam("Idempotency-Key", Guid.NewGuid())],
            HttpMethod.Post,
            JsonRequest.Create(request.Body),
            JsonResponse.Create<AgentCredentials>(),
            RegisterAgentError.Response,
            _auth.Admin,
            requestOptions,
            cancellationToken);

    /// <summary>
    /// Start wallet setup
    /// </summary>
    /// <param name="request">The operation's inputs</param>
    /// <param name="requestOptions">Per-request options, such as an overriding log level for this call</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>A <see cref="Task{TResult}"/> of <see cref="object"/> instance.</returns>
    /// <exception cref="ApiException{TError}"> of <see cref="StartWalletSetupError"/> when the server returns an error response.</exception>
    /// <remarks>
    /// Start PayPal wallet vaulting; returns the setup token with the buyer consent link
    /// </remarks>
    public Task<object> StartWalletSetup(StartWalletSetupRequest request,
        RequestOptions? requestOptions = null,
        CancellationToken cancellationToken = default) =>
        _rawClient.Execute(
            _server.Default("/v1/wallets/setup"),
            [],
            [],
            [new HeaderParam("Idempotency-Key", Guid.NewGuid())],
            HttpMethod.Post,
            JsonRequest.Create(request.Body),
            JsonResponse.Create<object>(),
            StartWalletSetupError.Response,
            _auth.Admin,
            requestOptions,
            cancellationToken);
}
