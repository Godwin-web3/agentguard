import { buildAuthSchemes, type AuthSchemes } from "./auth-schemes.js";
import type { ClientOptions } from "./client-options.js";
import { buildCoreClientOptions } from "./core/client-options.js";
import { RawClient } from "./core/raw-client.js";
import * as host from "./core/runtime-environment.js";
import * as s from "./core/validation/index.js";
import { Agent } from "./resources/agent.js";
import { Approvals } from "./resources/approvals.js";
import { Audit } from "./resources/audit.js";
import { Catalog } from "./resources/catalog.js";
import { Control } from "./resources/control.js";
import { Jobs } from "./resources/jobs.js";
import { Keys } from "./resources/keys.js";
import { Mandates } from "./resources/mandates.js";
import { Meta } from "./resources/meta.js";
import { Passkeys } from "./resources/passkeys.js";
import { Payments } from "./resources/payments.js";
import { Receipts } from "./resources/receipts.js";
import { Setup } from "./resources/setup.js";
import { buildServers, type Servers } from "./servers.js";

/**
 * Financial authorization gateway for AI agents paying through PayPal. Errors are `{"error":
 * string}`. Responses are JSON with `cache-control: no-store`. Docs:
 * https://agentguard-orcin.vercel.app/docs
 */
export class AgentGuardApiClient {
  readonly #rawClient: RawClient;
  readonly #servers: Servers;
  readonly #auth: AuthSchemes;
  #meta?: Meta;
  #jobs?: Jobs;
  #keys?: Keys;
  #receipts?: Receipts;
  #setup?: Setup;
  #mandates?: Mandates;
  #passkeys?: Passkeys;
  #approvals?: Approvals;
  #agent?: Agent;
  #catalog?: Catalog;
  #payments?: Payments;
  #control?: Control;
  #audit?: Audit;

  constructor(options: ClientOptions = {}) {
    this.#rawClient = new RawClient({
      ...buildCoreClientOptions(options, "AGENT_GUARD_API_CLIENT_LOG"),
      defaultHeaders: [
        { name: "User-Agent", value: "AgentGuardApiClient/0.1.0 TypeScript", schema: s.string() },
        { name: "X-APIMatic-Lang", value: "TypeScript", schema: s.string() },
        { name: "X-APIMatic-Package-Version", value: "0.1.0", schema: s.string() },
        { name: "X-APIMatic-Gen-Version", value: "4.0.0", schema: s.string() },
        { name: "X-APIMatic-OS", value: host.operatingSystem(), schema: s.optional(s.string()) },
        { name: "X-APIMatic-Runtime", value: host.runtimeDescription(), schema: s.optional(s.string()) },
      ],
      defaultQuery: [],
      defaultPathParams: [],
    });

    this.#servers = buildServers(options);

    this.#auth = buildAuthSchemes(options);
  }

  /**
   * Health and liveness
   */
  get meta(): Meta {
    return (this.#meta ??= new Meta(this.#rawClient, this.#servers));
  }

  /**
   * Scheduled jobs (Bearer CRON_SECRET)
   */
  get jobs(): Jobs {
    return (this.#jobs ??= new Jobs(this.#rawClient, this.#servers, this.#auth));
  }

  /**
   * Issuer signing keys: publish, rotate, mark compromised
   */
  get keys(): Keys {
    return (this.#keys ??= new Keys(this.#rawClient, this.#servers, this.#auth));
  }

  /**
   * Signed Proof-of-Intent receipts for captured payments
   */
  get receipts(): Receipts {
    return (this.#receipts ??= new Receipts(this.#rawClient, this.#servers, this.#auth));
  }

  /**
   * Agents and PayPal wallet vaulting
   */
  get setup(): Setup {
    return (this.#setup ??= new Setup(this.#rawClient, this.#servers, this.#auth));
  }

  /**
   * Spending mandates the user signs with a passkey
   */
  get mandates(): Mandates {
    return (this.#mandates ??= new Mandates(this.#rawClient, this.#servers, this.#auth));
  }

  /**
   * Passkey enrollment, re-enrollment and time-locked recovery
   */
  get passkeys(): Passkeys {
    return (this.#passkeys ??= new Passkeys(this.#rawClient, this.#servers, this.#auth));
  }

  /**
   * Payments held for the user's passkey approval
   */
  get approvals(): Approvals {
    return (this.#approvals ??= new Approvals(this.#rawClient, this.#servers, this.#auth));
  }

  /**
   * Calls an agent makes with its own key: product search, payments, receipts
   */
  get agent(): Agent {
    return (this.#agent ??= new Agent(this.#rawClient, this.#servers, this.#auth));
  }

  /**
   * Channel3 product search for the owner
   */
  get catalog(): Catalog {
    return (this.#catalog ??= new Catalog(this.#rawClient, this.#servers, this.#auth));
  }

  /**
   * Payment log and crash recovery
   */
  get payments(): Payments {
    return (this.#payments ??= new Payments(this.#rawClient, this.#servers, this.#auth));
  }

  /**
   * Operator kill-switch
   */
  get control(): Control {
    return (this.#control ??= new Control(this.#rawClient, this.#servers, this.#auth));
  }

  /**
   * Hash-chained audit ledger, attestations and anchors
   */
  get audit(): Audit {
    return (this.#audit ??= new Audit(this.#rawClient, this.#servers, this.#auth));
  }
}
