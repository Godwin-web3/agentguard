using System.Net.Http;
using AgentGuardApi.Api;
using AgentGuardApi.Core;
using AgentGuardApi.Core.Configuration;
using AgentGuardApi.Core.Logging;
using AgentGuardApi.Core.Models;

namespace AgentGuardApi;

/// <summary>
/// Financial authorization gateway for AI agents paying through PayPal. Errors are <c>{"error": string}</c>. Responses are JSON with <c>cache-control: no-store</c>. Docs: https://agentguard-orcin.vercel.app/docs
/// </summary>
public sealed class AgentGuardApiClient
{
    private readonly RawClient _rawClient;
    private readonly Server _server;
    private readonly AuthSchemes _auth;

    public AgentGuardApiClient(HttpClient httpClient, AgentGuardApiClientOptions options)
    {
        _server = new Server(options.Environment, options.Server);
        var queryParameterFactory = new QueryParameterFactory([]);
        var templateParamsFactory = new TemplateParamsFactory([]);
        var urlFactory = new UriFactory(queryParameterFactory, templateParamsFactory);
        var httpStatusPolicy = new HttpStatusPolicy([]);
        var headersFactory = new HeadersFactory([
            new HeaderParam("User-Agent", "AgentGuardApiClient/0.1.0 CSharp"),
            new HeaderParam("X-APIMatic-Lang", "CSharp"),
            new HeaderParam("X-APIMatic-Package-Version", "0.1.0"),
            new HeaderParam("X-APIMatic-Gen-Version", "4.0.0"),
            new HeaderParam("X-APIMatic-OS", RuntimeEnvironment.Os),
            new HeaderParam("X-APIMatic-Runtime", RuntimeEnvironment.Runtime),
        ]);
        var resiliencePipelineFactory = new ResiliencePipelineFactory(options.Retry, options.TimeProvider);
        var httpLogger = new HttpLogger(
            options.Logging.WithEnvironmentDefaults("AGENT_GUARD_API_LOG"),
            "AgentGuardApiClient",
            options.TimeProvider);
        var responseContexts = new ResponseContextFactory(options.TimeProvider, options.StreamReadTimeout);
        _rawClient =
            new RawClient(
                httpClient,
                urlFactory,
                httpStatusPolicy,
                headersFactory,
                resiliencePipelineFactory,
                httpLogger,
                options.Hooks,
                responseContexts);
        _auth = new AuthSchemes(options);
    }

    /// <summary>
    /// Calls an agent makes with its own key: product search, payments, receipts
    /// </summary>
    public Agent Agent => field ??= new Agent(_rawClient, _server, _auth);

    /// <summary>
    /// Payments held for the user's passkey approval
    /// </summary>
    public Approvals Approvals => field ??= new Approvals(_rawClient, _server, _auth);

    /// <summary>
    /// Hash-chained audit ledger, attestations and anchors
    /// </summary>
    public Audit Audit => field ??= new Audit(_rawClient, _server, _auth);

    /// <summary>
    /// Channel3 product search for the owner
    /// </summary>
    public Catalog Catalog => field ??= new Catalog(_rawClient, _server, _auth);

    /// <summary>
    /// Operator kill-switch
    /// </summary>
    public Control Control => field ??= new Control(_rawClient, _server, _auth);

    /// <summary>
    /// Scheduled jobs (Bearer CRON_SECRET)
    /// </summary>
    public Jobs Jobs => field ??= new Jobs(_rawClient, _server, _auth);

    /// <summary>
    /// Issuer signing keys: publish, rotate, mark compromised
    /// </summary>
    public Keys Keys => field ??= new Keys(_rawClient, _server, _auth);

    /// <summary>
    /// Spending mandates the user signs with a passkey
    /// </summary>
    public Mandates Mandates => field ??= new Mandates(_rawClient, _server, _auth);

    /// <summary>
    /// Health and liveness
    /// </summary>
    public Meta Meta => field ??= new Meta(_rawClient, _server);

    /// <summary>
    /// Passkey enrollment, re-enrollment and time-locked recovery
    /// </summary>
    public Passkeys Passkeys => field ??= new Passkeys(_rawClient, _server, _auth);

    /// <summary>
    /// Payment log and crash recovery
    /// </summary>
    public Payments Payments => field ??= new Payments(_rawClient, _server, _auth);

    /// <summary>
    /// Signed Proof-of-Intent receipts for captured payments
    /// </summary>
    public Receipts Receipts => field ??= new Receipts(_rawClient, _server, _auth);

    /// <summary>
    /// Agents and PayPal wallet vaulting
    /// </summary>
    public Setup Setup => field ??= new Setup(_rawClient, _server, _auth);
}
