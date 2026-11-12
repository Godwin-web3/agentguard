import type { AuthSchemes } from "../auth-schemes.js";
import { ApiError, type Declared, type Undeclared } from "../core/api-error.js";
import type { ApiPromise } from "../core/api-promise.js";
import type { RequestOptions } from "../core/api-request.js";
import { noneAuth } from "../core/auth/schemes.js";
import type { RawClient } from "../core/raw-client.js";
import type { ErrorDecoders } from "../core/response-decoder.js";
import { uuid } from "../core/uuid.js";
import * as s from "../core/validation/index.js";
import { agentCredentialsSchema, type AgentCredentials } from "../models/agent-credentials.js";
import { errorResponseSchema, type ErrorResponse } from "../models/error-response.js";
import { v1AgentsRequestSchema, type V1AgentsRequest } from "../models/v1-agents-request.js";
import { v1WalletsLinkRequestSchema, type V1WalletsLinkRequest } from "../models/v1-wallets-link-request.js";
import {
  v1WalletsSetupRequestSchema,
  type V1WalletsSetupRequest,
} from "../models/v1-wallets-setup-request.js";
import type { Servers } from "../servers.js";

/**
 * Agents and PayPal wallet vaulting
 */
export class Setup {
  readonly #rawClient: RawClient;
  readonly #servers: Servers;
  readonly #auth: AuthSchemes;

  constructor(rawClient: RawClient, servers: Servers, auth: AuthSchemes) {
    this.#rawClient = rawClient;
    this.#servers = servers;
    this.#auth = auth;
  }

  /**
   * Complete wallet setup
   *
   * @remarks
   * PayPal redirect target after buyer consent; links the vaulted wallet
   *
   * @returns OK
   *
   * @throws {@link Setup.CompleteWalletSetupError} when the API answers with an error status —
   * narrow on `err.payload.kind`
   *
   * @throws {@link AgentGuardApiError} when no usable response was produced: a connection failure,
   * a timeout, a body that would not decode, a value that would not encode, or a credential that
   * could not be obtained
   */
  completeWalletSetup(
    request: Setup.CompleteWalletSetupRequest = {},
    options?: RequestOptions,
  ): ApiPromise<Record<string, unknown>, Setup.CompleteWalletSetupError> {
    return this.#rawClient.execute(
      {
        method: "GET",
        urlTemplate: this.#servers.default("/v1/wallets/return"),
        auth: noneAuth,
        pathParams: [],
        query: [
          { name: "state", value: request.state, schema: s.optional(s.string()) },
          { name: "approval_token_id", value: request.approvalTokenId, schema: s.optional(s.string()) },
        ],
        headers: [],
        body: { kind: "empty" },
      },
      {
        success: { kind: "json", schema: s.record(s.string(), s.unknown()) },
        errorFactory: Setup.CompleteWalletSetupError,
      },
      options,
    );
  }

  /**
   * Link wallet
   *
   * @remarks
   * Link an existing PayPal vault id to a user
   *
   * @returns OK
   *
   * @throws {@link Setup.LinkWalletError} when the API answers with an error status — narrow on
   * `err.payload.kind`
   *
   * @throws {@link AgentGuardApiError} when no usable response was produced: a connection failure,
   * a timeout, a body that would not decode, a value that would not encode, or a credential that
   * could not be obtained
   */
  linkWallet(
    request: Setup.LinkWalletRequest,
    options?: RequestOptions,
  ): ApiPromise<Record<string, unknown>, Setup.LinkWalletError> {
    return this.#rawClient.execute(
      {
        method: "POST",
        urlTemplate: this.#servers.default("/v1/wallets/link"),
        auth: this.#auth.admin,
        pathParams: [],
        query: [],
        headers: [{ name: "Idempotency-Key", value: uuid(), schema: s.string() }],
        body: { kind: "json", value: request.body, schema: v1WalletsLinkRequestSchema },
      },
      {
        success: { kind: "json", schema: s.record(s.string(), s.unknown()) },
        errorFactory: Setup.LinkWalletError,
      },
      options,
    );
  }

  /**
   * Register agent
   *
   * @remarks
   * Register an agent and return its API key (shown once)
   *
   * @returns OK
   *
   * @throws {@link Setup.RegisterAgentError} when the API answers with an error status — narrow on
   * `err.payload.kind`
   *
   * @throws {@link AgentGuardApiError} when no usable response was produced: a connection failure,
   * a timeout, a body that would not decode, a value that would not encode, or a credential that
   * could not be obtained
   */
  registerAgent(
    request: Setup.RegisterAgentRequest,
    options?: RequestOptions,
  ): ApiPromise<AgentCredentials, Setup.RegisterAgentError> {
    return this.#rawClient.execute(
      {
        method: "POST",
        urlTemplate: this.#servers.default("/v1/agents"),
        auth: this.#auth.admin,
        pathParams: [],
        query: [],
        headers: [{ name: "Idempotency-Key", value: uuid(), schema: s.string() }],
        body: { kind: "json", value: request.body, schema: v1AgentsRequestSchema },
      },
      {
        success: { kind: "json", schema: agentCredentialsSchema },
        errorFactory: Setup.RegisterAgentError,
      },
      options,
    );
  }

  /**
   * Start wallet setup
   *
   * @remarks
   * Start PayPal wallet vaulting; returns the setup token with the buyer consent link
   *
   * @returns OK
   *
   * @throws {@link Setup.StartWalletSetupError} when the API answers with an error status — narrow
   * on `err.payload.kind`
   *
   * @throws {@link AgentGuardApiError} when no usable response was produced: a connection failure,
   * a timeout, a body that would not decode, a value that would not encode, or a credential that
   * could not be obtained
   */
  startWalletSetup(
    request: Setup.StartWalletSetupRequest,
    options?: RequestOptions,
  ): ApiPromise<Record<string, unknown>, Setup.StartWalletSetupError> {
    return this.#rawClient.execute(
      {
        method: "POST",
        urlTemplate: this.#servers.default("/v1/wallets/setup"),
        auth: this.#auth.admin,
        pathParams: [],
        query: [],
        headers: [{ name: "Idempotency-Key", value: uuid(), schema: s.string() }],
        body: { kind: "json", value: request.body, schema: v1WalletsSetupRequestSchema },
      },
      {
        success: { kind: "json", schema: s.record(s.string(), s.unknown()) },
        errorFactory: Setup.StartWalletSetupError,
      },
      options,
    );
  }
}

export namespace Setup {
  export type CompleteWalletSetupRequest = {
    /** One-time state from /v1/wallets/setup */
    state?: string;
    /** PayPal setup token id */
    approvalTokenId?: string;
  };

  export class CompleteWalletSetupError extends ApiError {
    declare readonly payload:
      | Declared<"errorResponse", ErrorResponse>
      | Declared<"errorResponse2", ErrorResponse>
      | Declared<"errorResponse3", ErrorResponse>
      | Declared<"errorResponse4", ErrorResponse>
      | Undeclared;

    static readonly errors: ErrorDecoders<CompleteWalletSetupError> = [
      { on: 400, kind: "errorResponse", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 404, kind: "errorResponse2", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 413, kind: "errorResponse3", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 500, kind: "errorResponse4", decode: { kind: "json", schema: errorResponseSchema } },
    ];
  }

  export type LinkWalletRequest = {
    body: V1WalletsLinkRequest;
  };

  export class LinkWalletError extends ApiError {
    declare readonly payload:
      | Declared<"errorResponse", ErrorResponse>
      | Declared<"errorResponse2", ErrorResponse>
      | Declared<"errorResponse3", ErrorResponse>
      | Declared<"errorResponse4", ErrorResponse>
      | Declared<"errorResponse5", ErrorResponse>
      | Undeclared;

    static readonly errors: ErrorDecoders<LinkWalletError> = [
      { on: 400, kind: "errorResponse", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 401, kind: "errorResponse2", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 404, kind: "errorResponse3", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 413, kind: "errorResponse4", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 500, kind: "errorResponse5", decode: { kind: "json", schema: errorResponseSchema } },
    ];
  }

  export type RegisterAgentRequest = {
    body: V1AgentsRequest;
  };

  export class RegisterAgentError extends ApiError {
    declare readonly payload:
      | Declared<"errorResponse", ErrorResponse>
      | Declared<"errorResponse2", ErrorResponse>
      | Declared<"errorResponse3", ErrorResponse>
      | Declared<"errorResponse4", ErrorResponse>
      | Declared<"errorResponse5", ErrorResponse>
      | Undeclared;

    static readonly errors: ErrorDecoders<RegisterAgentError> = [
      { on: 400, kind: "errorResponse", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 401, kind: "errorResponse2", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 404, kind: "errorResponse3", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 413, kind: "errorResponse4", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 500, kind: "errorResponse5", decode: { kind: "json", schema: errorResponseSchema } },
    ];
  }

  export type StartWalletSetupRequest = {
    body: V1WalletsSetupRequest;
  };

  export class StartWalletSetupError extends ApiError {
    declare readonly payload:
      | Declared<"errorResponse", ErrorResponse>
      | Declared<"errorResponse2", ErrorResponse>
      | Declared<"errorResponse3", ErrorResponse>
      | Declared<"errorResponse4", ErrorResponse>
      | Declared<"errorResponse5", ErrorResponse>
      | Undeclared;

    static readonly errors: ErrorDecoders<StartWalletSetupError> = [
      { on: 400, kind: "errorResponse", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 401, kind: "errorResponse2", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 404, kind: "errorResponse3", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 413, kind: "errorResponse4", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 500, kind: "errorResponse5", decode: { kind: "json", schema: errorResponseSchema } },
    ];
  }
}
