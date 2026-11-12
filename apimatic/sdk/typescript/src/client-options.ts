import type { TokenProvider } from "./core/auth/credentials.js";
import type { CoreClientOptions } from "./core/client-options.js";
import { ServerEnvironment } from "./servers.js";

export type ClientOptions = SdkClientOptions & CoreClientOptions;

type SdkClientOptions = ServerOptions & {
  /** AGENTGUARD_ADMIN_TOKEN (owner/operator) */
  readonly admin?: TokenProvider | undefined;
  /** Per-agent API key from POST /v1/agents */
  readonly agent?: TokenProvider | undefined;
  /** CRON_SECRET */
  readonly cron?: TokenProvider | undefined;
};

type ServerOptions =
  | {
      readonly serverEnvironment?: typeof ServerEnvironment.Production;
      /** Hosted demo (PayPal sandbox) */
      readonly serverOptions?: {
        baseUrl?: string;
      };
    }
  | {
      readonly serverEnvironment: typeof ServerEnvironment.Environment2;
      /** Hosted demo (PayPal sandbox) */
      readonly serverOptions?: {
        baseUrl?: string;
      };
    };
