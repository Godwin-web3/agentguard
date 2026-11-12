import type { AuthSchemes } from "../auth-schemes.js";
import { ApiError, type Declared, type Undeclared } from "../core/api-error.js";
import type { ApiPromise } from "../core/api-promise.js";
import type { RequestOptions } from "../core/api-request.js";
import { noneAuth } from "../core/auth/schemes.js";
import type { RawClient } from "../core/raw-client.js";
import type { ErrorDecoders } from "../core/response-decoder.js";
import { uuid } from "../core/uuid.js";
import * as s from "../core/validation/index.js";
import { errorResponseSchema, type ErrorResponse } from "../models/error-response.js";
import { issuerKeySetSchema, type IssuerKeySet } from "../models/issuer-key-set.js";
import {
  v1KeysCompromisedRequestSchema,
  type V1KeysCompromisedRequest,
} from "../models/v1-keys-compromised-request.js";
import type { Servers } from "../servers.js";

/**
 * Issuer signing keys: publish, rotate, mark compromised
 */
export class Keys {
  readonly #rawClient: RawClient;
  readonly #servers: Servers;
  readonly #auth: AuthSchemes;

  constructor(rawClient: RawClient, servers: Servers, auth: AuthSchemes) {
    this.#rawClient = rawClient;
    this.#servers = servers;
    this.#auth = auth;
  }

  /**
   * Get issuer key
   *
   * @remarks
   * Active issuer public key (legacy single-key form)
   *
   * @returns OK
   *
   * @throws {@link Keys.GetIssuerKeyError} when the API answers with an error status — narrow on
   * `err.payload.kind`
   *
   * @throws {@link AgentGuardApiError} when no usable response was produced: a connection failure,
   * a timeout, a body that would not decode, a value that would not encode, or a credential that
   * could not be obtained
   */
  getIssuerKey(options?: RequestOptions): ApiPromise<Record<string, unknown>, Keys.GetIssuerKeyError> {
    return this.#rawClient.execute(
      {
        method: "GET",
        urlTemplate: this.#servers.default("/.well-known/agentguard-key"),
        auth: noneAuth,
        pathParams: [],
        query: [],
        headers: [],
        body: { kind: "empty" },
      },
      {
        success: { kind: "json", schema: s.record(s.string(), s.unknown()) },
        errorFactory: Keys.GetIssuerKeyError,
      },
      options,
    );
  }

  /**
   * Get issuer key set
   *
   * @remarks
   * Issuer key set: every key with kid, status, created_at, retired_at, compromised_at. Pin this.
   *
   * @returns OK
   *
   * @throws {@link Keys.GetIssuerKeySetError} when the API answers with an error status — narrow on
   * `err.payload.kind`
   *
   * @throws {@link AgentGuardApiError} when no usable response was produced: a connection failure,
   * a timeout, a body that would not decode, a value that would not encode, or a credential that
   * could not be obtained
   */
  getIssuerKeySet(options?: RequestOptions): ApiPromise<IssuerKeySet, Keys.GetIssuerKeySetError> {
    return this.#rawClient.execute(
      {
        method: "GET",
        urlTemplate: this.#servers.default("/.well-known/agentguard-keys"),
        auth: noneAuth,
        pathParams: [],
        query: [],
        headers: [],
        body: { kind: "empty" },
      },
      {
        success: { kind: "json", schema: issuerKeySetSchema },
        errorFactory: Keys.GetIssuerKeySetError,
      },
      options,
    );
  }

  /**
   * Mark key compromised
   *
   * @remarks
   * Mark a key compromised as of `at` (rotates first if active)
   *
   * @returns OK
   *
   * @throws {@link Keys.MarkKeyCompromisedError} when the API answers with an error status — narrow
   * on `err.payload.kind`
   *
   * @throws {@link AgentGuardApiError} when no usable response was produced: a connection failure,
   * a timeout, a body that would not decode, a value that would not encode, or a credential that
   * could not be obtained
   */
  markKeyCompromised(
    request: Keys.MarkKeyCompromisedRequest,
    options?: RequestOptions,
  ): ApiPromise<Record<string, unknown>, Keys.MarkKeyCompromisedError> {
    return this.#rawClient.execute(
      {
        method: "POST",
        urlTemplate: this.#servers.default("/v1/keys/{kid}/compromised"),
        auth: this.#auth.admin,
        pathParams: [{ name: "kid", value: request.kid, schema: s.string() }],
        query: [],
        headers: [{ name: "Idempotency-Key", value: uuid(), schema: s.string() }],
        body: {
          kind: "json",
          value: request.body,
          schema: s.optional(s.lazy(() => v1KeysCompromisedRequestSchema)),
        },
      },
      {
        success: { kind: "json", schema: s.record(s.string(), s.unknown()) },
        errorFactory: Keys.MarkKeyCompromisedError,
      },
      options,
    );
  }

  /**
   * Rotate issuer key
   *
   * @remarks
   * Retire the active issuer key and create a new one (audited)
   *
   * @returns OK
   *
   * @throws {@link Keys.RotateIssuerKeyError} when the API answers with an error status — narrow on
   * `err.payload.kind`
   *
   * @throws {@link AgentGuardApiError} when no usable response was produced: a connection failure,
   * a timeout, a body that would not decode, a value that would not encode, or a credential that
   * could not be obtained
   */
  rotateIssuerKey(options?: RequestOptions): ApiPromise<Record<string, unknown>, Keys.RotateIssuerKeyError> {
    return this.#rawClient.execute(
      {
        method: "POST",
        urlTemplate: this.#servers.default("/v1/keys/rotate"),
        auth: this.#auth.admin,
        pathParams: [],
        query: [],
        headers: [{ name: "Idempotency-Key", value: uuid(), schema: s.string() }],
        body: { kind: "empty" },
      },
      {
        success: { kind: "json", schema: s.record(s.string(), s.unknown()) },
        errorFactory: Keys.RotateIssuerKeyError,
      },
      options,
    );
  }
}

export namespace Keys {
  export class GetIssuerKeyError extends ApiError {
    declare readonly payload:
      | Declared<"errorResponse", ErrorResponse>
      | Declared<"errorResponse2", ErrorResponse>
      | Declared<"errorResponse3", ErrorResponse>
      | Declared<"errorResponse4", ErrorResponse>
      | Undeclared;

    static readonly errors: ErrorDecoders<GetIssuerKeyError> = [
      { on: 400, kind: "errorResponse", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 404, kind: "errorResponse2", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 413, kind: "errorResponse3", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 500, kind: "errorResponse4", decode: { kind: "json", schema: errorResponseSchema } },
    ];
  }

  export class GetIssuerKeySetError extends ApiError {
    declare readonly payload:
      | Declared<"errorResponse", ErrorResponse>
      | Declared<"errorResponse2", ErrorResponse>
      | Declared<"errorResponse3", ErrorResponse>
      | Declared<"errorResponse4", ErrorResponse>
      | Undeclared;

    static readonly errors: ErrorDecoders<GetIssuerKeySetError> = [
      { on: 400, kind: "errorResponse", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 404, kind: "errorResponse2", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 413, kind: "errorResponse3", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 500, kind: "errorResponse4", decode: { kind: "json", schema: errorResponseSchema } },
    ];
  }

  export type MarkKeyCompromisedRequest = {
    kid: string;
    body?: V1KeysCompromisedRequest;
  };

  export class MarkKeyCompromisedError extends ApiError {
    declare readonly payload:
      | Declared<"errorResponse", ErrorResponse>
      | Declared<"errorResponse2", ErrorResponse>
      | Declared<"errorResponse3", ErrorResponse>
      | Declared<"errorResponse4", ErrorResponse>
      | Declared<"errorResponse5", ErrorResponse>
      | Undeclared;

    static readonly errors: ErrorDecoders<MarkKeyCompromisedError> = [
      { on: 400, kind: "errorResponse", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 401, kind: "errorResponse2", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 404, kind: "errorResponse3", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 413, kind: "errorResponse4", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 500, kind: "errorResponse5", decode: { kind: "json", schema: errorResponseSchema } },
    ];
  }

  export class RotateIssuerKeyError extends ApiError {
    declare readonly payload:
      | Declared<"errorResponse", ErrorResponse>
      | Declared<"errorResponse2", ErrorResponse>
      | Declared<"errorResponse3", ErrorResponse>
      | Declared<"errorResponse4", ErrorResponse>
      | Declared<"errorResponse5", ErrorResponse>
      | Undeclared;

    static readonly errors: ErrorDecoders<RotateIssuerKeyError> = [
      { on: 400, kind: "errorResponse", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 401, kind: "errorResponse2", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 404, kind: "errorResponse3", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 413, kind: "errorResponse4", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 500, kind: "errorResponse5", decode: { kind: "json", schema: errorResponseSchema } },
    ];
  }
}
