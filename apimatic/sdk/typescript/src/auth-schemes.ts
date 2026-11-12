import type { ClientOptions } from "./client-options.js";
import type { AuthScheme } from "./core/api-request.js";
import { bearerAuth } from "./core/auth/schemes.js";

export type AuthSchemes = {
  readonly admin: AuthScheme;
  readonly agent: AuthScheme;
  readonly cron: AuthScheme;
};

export function buildAuthSchemes(options: ClientOptions): AuthSchemes {
  return {
    admin: bearerAuth(options.admin),
    agent: bearerAuth(options.agent),
    cron: bearerAuth(options.cron),
  };
}
