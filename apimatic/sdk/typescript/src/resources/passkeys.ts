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
import {
  v1EnrollOptionsRequestSchema,
  type V1EnrollOptionsRequest,
} from "../models/v1-enroll-options-request.js";
import { v1EnrollRequestSchema, type V1EnrollRequest } from "../models/v1-enroll-request.js";
import {
  v1UsersEnrollmentsRequestSchema,
  type V1UsersEnrollmentsRequest,
} from "../models/v1-users-enrollments-request.js";
import {
  v1UsersRecoveryCancelRequestSchema,
  type V1UsersRecoveryCancelRequest,
} from "../models/v1-users-recovery-cancel-request.js";
import {
  v1UsersReenrollRequestSchema,
  type V1UsersReenrollRequest,
} from "../models/v1-users-reenroll-request.js";
import type { Servers } from "../servers.js";

/**
 * Passkey enrollment, re-enrollment and time-locked recovery
 */
export class Passkeys {
  readonly #rawClient: RawClient;
  readonly #servers: Servers;
  readonly #auth: AuthSchemes;

  constructor(rawClient: RawClient, servers: Servers, auth: AuthSchemes) {
    this.#rawClient = rawClient;
    this.#servers = servers;
    this.#auth = auth;
  }

  /**
   * Cancel recovery
   *
   * @remarks
   * Cancel a pending recovery
   *
   * @returns OK
   *
   * @throws {@link Passkeys.CancelRecoveryError} when the API answers with an error status — narrow
   * on `err.payload.kind`
   *
   * @throws {@link AgentGuardApiError} when no usable response was produced: a connection failure,
   * a timeout, a body that would not decode, a value that would not encode, or a credential that
   * could not be obtained
   */
  cancelRecovery(
    request: Passkeys.CancelRecoveryRequest,
    options?: RequestOptions,
  ): ApiPromise<Record<string, unknown>, Passkeys.CancelRecoveryError> {
    return this.#rawClient.execute(
      {
        method: "POST",
        urlTemplate: this.#servers.default("/v1/users/{id}/recovery/cancel"),
        auth: noneAuth,
        pathParams: [{ name: "id", value: request.id, schema: s.string() }],
        query: [],
        headers: [{ name: "Idempotency-Key", value: uuid(), schema: s.string() }],
        body: { kind: "json", value: request.body, schema: v1UsersRecoveryCancelRequestSchema },
      },
      {
        success: { kind: "json", schema: s.record(s.string(), s.unknown()) },
        errorFactory: Passkeys.CancelRecoveryError,
      },
      options,
    );
  }

  /**
   * Create enrollment link
   *
   * @remarks
   * Issue a single-use enrollment link (15 min default)
   *
   * @returns OK
   *
   * @throws {@link Passkeys.CreateEnrollmentLinkError} when the API answers with an error status —
   * narrow on `err.payload.kind`
   *
   * @throws {@link AgentGuardApiError} when no usable response was produced: a connection failure,
   * a timeout, a body that would not decode, a value that would not encode, or a credential that
   * could not be obtained
   */
  createEnrollmentLink(
    request: Passkeys.CreateEnrollmentLinkRequest,
    options?: RequestOptions,
  ): ApiPromise<Record<string, unknown>, Passkeys.CreateEnrollmentLinkError> {
    return this.#rawClient.execute(
      {
        method: "POST",
        urlTemplate: this.#servers.default("/v1/users/{id}/enrollments"),
        auth: this.#auth.admin,
        pathParams: [{ name: "id", value: request.id, schema: s.string() }],
        query: [],
        headers: [{ name: "Idempotency-Key", value: uuid(), schema: s.string() }],
        body: {
          kind: "json",
          value: request.body,
          schema: s.optional(s.lazy(() => v1UsersEnrollmentsRequestSchema)),
        },
      },
      {
        success: { kind: "json", schema: s.record(s.string(), s.unknown()) },
        errorFactory: Passkeys.CreateEnrollmentLinkError,
      },
      options,
    );
  }

  /**
   * Register a passkey
   *
   * @remarks
   * Redeem step 2: register the passkey
   *
   * @returns OK
   *
   * @throws {@link Passkeys.EnrollPasskeyError} when the API answers with an error status — narrow
   * on `err.payload.kind`
   *
   * @throws {@link AgentGuardApiError} when no usable response was produced: a connection failure,
   * a timeout, a body that would not decode, a value that would not encode, or a credential that
   * could not be obtained
   */
  enrollPasskey(
    request: Passkeys.EnrollPasskeyRequest,
    options?: RequestOptions,
  ): ApiPromise<Record<string, unknown>, Passkeys.EnrollPasskeyError> {
    return this.#rawClient.execute(
      {
        method: "POST",
        urlTemplate: this.#servers.default("/v1/enroll"),
        auth: noneAuth,
        pathParams: [],
        query: [],
        headers: [{ name: "Idempotency-Key", value: uuid(), schema: s.string() }],
        body: { kind: "json", value: request.body, schema: v1EnrollRequestSchema },
      },
      {
        success: { kind: "json", schema: s.record(s.string(), s.unknown()) },
        errorFactory: Passkeys.EnrollPasskeyError,
      },
      options,
    );
  }

  /**
   * Get passkey registration options
   *
   * @remarks
   * Redeem step 1: registration options for an enrollment token
   *
   * @returns OK
   *
   * @throws {@link Passkeys.GetEnrollmentOptionsError} when the API answers with an error status —
   * narrow on `err.payload.kind`
   *
   * @throws {@link AgentGuardApiError} when no usable response was produced: a connection failure,
   * a timeout, a body that would not decode, a value that would not encode, or a credential that
   * could not be obtained
   */
  getEnrollmentOptions(
    request: Passkeys.GetEnrollmentOptionsRequest,
    options?: RequestOptions,
  ): ApiPromise<Record<string, unknown>, Passkeys.GetEnrollmentOptionsError> {
    return this.#rawClient.execute(
      {
        method: "POST",
        urlTemplate: this.#servers.default("/v1/enroll/options"),
        auth: noneAuth,
        pathParams: [],
        query: [],
        headers: [{ name: "Idempotency-Key", value: uuid(), schema: s.string() }],
        body: { kind: "json", value: request.body, schema: v1EnrollOptionsRequestSchema },
      },
      {
        success: { kind: "json", schema: s.record(s.string(), s.unknown()) },
        errorFactory: Passkeys.GetEnrollmentOptionsError,
      },
      options,
    );
  }

  /**
   * Get recovery cancel options
   *
   * @remarks
   * Options to cancel a recovery with the current passkey
   *
   * @returns OK
   *
   * @throws {@link Passkeys.GetRecoveryCancelOptionsError} when the API answers with an error
   * status — narrow on `err.payload.kind`
   *
   * @throws {@link AgentGuardApiError} when no usable response was produced: a connection failure,
   * a timeout, a body that would not decode, a value that would not encode, or a credential that
   * could not be obtained
   */
  getRecoveryCancelOptions(
    request: Passkeys.GetRecoveryCancelOptionsRequest,
    options?: RequestOptions,
  ): ApiPromise<Record<string, unknown>, Passkeys.GetRecoveryCancelOptionsError> {
    return this.#rawClient.execute(
      {
        method: "POST",
        urlTemplate: this.#servers.default("/v1/users/{id}/recovery/cancel-request"),
        auth: noneAuth,
        pathParams: [{ name: "id", value: request.id, schema: s.string() }],
        query: [],
        headers: [{ name: "Idempotency-Key", value: uuid(), schema: s.string() }],
        body: { kind: "empty" },
      },
      {
        success: { kind: "json", schema: s.record(s.string(), s.unknown()) },
        errorFactory: Passkeys.GetRecoveryCancelOptionsError,
      },
      options,
    );
  }

  /**
   * Get recovery state
   *
   * @remarks
   * Time-locked recovery state
   *
   * @returns OK
   *
   * @throws {@link Passkeys.GetRecoveryStateError} when the API answers with an error status —
   * narrow on `err.payload.kind`
   *
   * @throws {@link AgentGuardApiError} when no usable response was produced: a connection failure,
   * a timeout, a body that would not decode, a value that would not encode, or a credential that
   * could not be obtained
   */
  getRecoveryState(
    request: Passkeys.GetRecoveryStateRequest,
    options?: RequestOptions,
  ): ApiPromise<Record<string, unknown>, Passkeys.GetRecoveryStateError> {
    return this.#rawClient.execute(
      {
        method: "GET",
        urlTemplate: this.#servers.default("/v1/users/{id}/recovery"),
        auth: this.#auth.admin,
        pathParams: [{ name: "id", value: request.id, schema: s.string() }],
        query: [],
        headers: [],
        body: { kind: "empty" },
      },
      {
        success: { kind: "json", schema: s.record(s.string(), s.unknown()) },
        errorFactory: Passkeys.GetRecoveryStateError,
      },
      options,
    );
  }

  /**
   * Get reenrollment options
   *
   * @remarks
   * Options for replacing a passkey with the current one
   *
   * @returns OK
   *
   * @throws {@link Passkeys.GetReenrollmentOptionsError} when the API answers with an error status
   * — narrow on `err.payload.kind`
   *
   * @throws {@link AgentGuardApiError} when no usable response was produced: a connection failure,
   * a timeout, a body that would not decode, a value that would not encode, or a credential that
   * could not be obtained
   */
  getReenrollmentOptions(
    request: Passkeys.GetReenrollmentOptionsRequest,
    options?: RequestOptions,
  ): ApiPromise<Record<string, unknown>, Passkeys.GetReenrollmentOptionsError> {
    return this.#rawClient.execute(
      {
        method: "POST",
        urlTemplate: this.#servers.default("/v1/users/{id}/reenroll-request"),
        auth: this.#auth.admin,
        pathParams: [{ name: "id", value: request.id, schema: s.string() }],
        query: [],
        headers: [{ name: "Idempotency-Key", value: uuid(), schema: s.string() }],
        body: { kind: "empty" },
      },
      {
        success: { kind: "json", schema: s.record(s.string(), s.unknown()) },
        errorFactory: Passkeys.GetReenrollmentOptionsError,
      },
      options,
    );
  }

  /**
   * Get user passkey
   *
   * @remarks
   * Whether the user has a passkey, and its credential id
   *
   * @returns OK
   *
   * @throws {@link Passkeys.GetUserPasskeyError} when the API answers with an error status — narrow
   * on `err.payload.kind`
   *
   * @throws {@link AgentGuardApiError} when no usable response was produced: a connection failure,
   * a timeout, a body that would not decode, a value that would not encode, or a credential that
   * could not be obtained
   */
  getUserPasskey(
    request: Passkeys.GetUserPasskeyRequest,
    options?: RequestOptions,
  ): ApiPromise<Record<string, unknown>, Passkeys.GetUserPasskeyError> {
    return this.#rawClient.execute(
      {
        method: "GET",
        urlTemplate: this.#servers.default("/v1/users/{id}/passkey"),
        auth: this.#auth.admin,
        pathParams: [{ name: "id", value: request.id, schema: s.string() }],
        query: [],
        headers: [],
        body: { kind: "empty" },
      },
      {
        success: { kind: "json", schema: s.record(s.string(), s.unknown()) },
        errorFactory: Passkeys.GetUserPasskeyError,
      },
      options,
    );
  }

  /**
   * Reenroll passkey
   *
   * @remarks
   * Mint a re-enrollment token authorized by the current passkey
   *
   * @returns OK
   *
   * @throws {@link Passkeys.ReenrollPasskeyError} when the API answers with an error status —
   * narrow on `err.payload.kind`
   *
   * @throws {@link AgentGuardApiError} when no usable response was produced: a connection failure,
   * a timeout, a body that would not decode, a value that would not encode, or a credential that
   * could not be obtained
   */
  reenrollPasskey(
    request: Passkeys.ReenrollPasskeyRequest,
    options?: RequestOptions,
  ): ApiPromise<Record<string, unknown>, Passkeys.ReenrollPasskeyError> {
    return this.#rawClient.execute(
      {
        method: "POST",
        urlTemplate: this.#servers.default("/v1/users/{id}/reenroll"),
        auth: this.#auth.admin,
        pathParams: [{ name: "id", value: request.id, schema: s.string() }],
        query: [],
        headers: [{ name: "Idempotency-Key", value: uuid(), schema: s.string() }],
        body: { kind: "json", value: request.body, schema: v1UsersReenrollRequestSchema },
      },
      {
        success: { kind: "json", schema: s.record(s.string(), s.unknown()) },
        errorFactory: Passkeys.ReenrollPasskeyError,
      },
      options,
    );
  }
}

export namespace Passkeys {
  export type CancelRecoveryRequest = {
    id: string;
    body: V1UsersRecoveryCancelRequest;
  };

  export class CancelRecoveryError extends ApiError {
    declare readonly payload:
      | Declared<"errorResponse", ErrorResponse>
      | Declared<"errorResponse2", ErrorResponse>
      | Declared<"errorResponse3", ErrorResponse>
      | Declared<"errorResponse4", ErrorResponse>
      | Undeclared;

    static readonly errors: ErrorDecoders<CancelRecoveryError> = [
      { on: 400, kind: "errorResponse", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 404, kind: "errorResponse2", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 413, kind: "errorResponse3", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 500, kind: "errorResponse4", decode: { kind: "json", schema: errorResponseSchema } },
    ];
  }

  export type CreateEnrollmentLinkRequest = {
    id: string;
    body?: V1UsersEnrollmentsRequest;
  };

  export class CreateEnrollmentLinkError extends ApiError {
    declare readonly payload:
      | Declared<"errorResponse", ErrorResponse>
      | Declared<"errorResponse2", ErrorResponse>
      | Declared<"errorResponse3", ErrorResponse>
      | Declared<"errorResponse4", ErrorResponse>
      | Declared<"errorResponse5", ErrorResponse>
      | Undeclared;

    static readonly errors: ErrorDecoders<CreateEnrollmentLinkError> = [
      { on: 400, kind: "errorResponse", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 401, kind: "errorResponse2", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 404, kind: "errorResponse3", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 413, kind: "errorResponse4", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 500, kind: "errorResponse5", decode: { kind: "json", schema: errorResponseSchema } },
    ];
  }

  export type EnrollPasskeyRequest = {
    body: V1EnrollRequest;
  };

  export class EnrollPasskeyError extends ApiError {
    declare readonly payload:
      | Declared<"errorResponse", ErrorResponse>
      | Declared<"errorResponse2", ErrorResponse>
      | Declared<"errorResponse3", ErrorResponse>
      | Declared<"errorResponse4", ErrorResponse>
      | Undeclared;

    static readonly errors: ErrorDecoders<EnrollPasskeyError> = [
      { on: 400, kind: "errorResponse", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 404, kind: "errorResponse2", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 413, kind: "errorResponse3", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 500, kind: "errorResponse4", decode: { kind: "json", schema: errorResponseSchema } },
    ];
  }

  export type GetEnrollmentOptionsRequest = {
    body: V1EnrollOptionsRequest;
  };

  export class GetEnrollmentOptionsError extends ApiError {
    declare readonly payload:
      | Declared<"errorResponse", ErrorResponse>
      | Declared<"errorResponse2", ErrorResponse>
      | Declared<"errorResponse3", ErrorResponse>
      | Declared<"errorResponse4", ErrorResponse>
      | Undeclared;

    static readonly errors: ErrorDecoders<GetEnrollmentOptionsError> = [
      { on: 400, kind: "errorResponse", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 404, kind: "errorResponse2", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 413, kind: "errorResponse3", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 500, kind: "errorResponse4", decode: { kind: "json", schema: errorResponseSchema } },
    ];
  }

  export type GetRecoveryCancelOptionsRequest = {
    id: string;
  };

  export class GetRecoveryCancelOptionsError extends ApiError {
    declare readonly payload:
      | Declared<"errorResponse", ErrorResponse>
      | Declared<"errorResponse2", ErrorResponse>
      | Declared<"errorResponse3", ErrorResponse>
      | Declared<"errorResponse4", ErrorResponse>
      | Undeclared;

    static readonly errors: ErrorDecoders<GetRecoveryCancelOptionsError> = [
      { on: 400, kind: "errorResponse", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 404, kind: "errorResponse2", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 413, kind: "errorResponse3", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 500, kind: "errorResponse4", decode: { kind: "json", schema: errorResponseSchema } },
    ];
  }

  export type GetRecoveryStateRequest = {
    id: string;
  };

  export class GetRecoveryStateError extends ApiError {
    declare readonly payload:
      | Declared<"errorResponse", ErrorResponse>
      | Declared<"errorResponse2", ErrorResponse>
      | Declared<"errorResponse3", ErrorResponse>
      | Declared<"errorResponse4", ErrorResponse>
      | Declared<"errorResponse5", ErrorResponse>
      | Undeclared;

    static readonly errors: ErrorDecoders<GetRecoveryStateError> = [
      { on: 400, kind: "errorResponse", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 401, kind: "errorResponse2", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 404, kind: "errorResponse3", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 413, kind: "errorResponse4", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 500, kind: "errorResponse5", decode: { kind: "json", schema: errorResponseSchema } },
    ];
  }

  export type GetReenrollmentOptionsRequest = {
    id: string;
  };

  export class GetReenrollmentOptionsError extends ApiError {
    declare readonly payload:
      | Declared<"errorResponse", ErrorResponse>
      | Declared<"errorResponse2", ErrorResponse>
      | Declared<"errorResponse3", ErrorResponse>
      | Declared<"errorResponse4", ErrorResponse>
      | Declared<"errorResponse5", ErrorResponse>
      | Undeclared;

    static readonly errors: ErrorDecoders<GetReenrollmentOptionsError> = [
      { on: 400, kind: "errorResponse", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 401, kind: "errorResponse2", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 404, kind: "errorResponse3", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 413, kind: "errorResponse4", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 500, kind: "errorResponse5", decode: { kind: "json", schema: errorResponseSchema } },
    ];
  }

  export type GetUserPasskeyRequest = {
    id: string;
  };

  export class GetUserPasskeyError extends ApiError {
    declare readonly payload:
      | Declared<"errorResponse", ErrorResponse>
      | Declared<"errorResponse2", ErrorResponse>
      | Declared<"errorResponse3", ErrorResponse>
      | Declared<"errorResponse4", ErrorResponse>
      | Declared<"errorResponse5", ErrorResponse>
      | Undeclared;

    static readonly errors: ErrorDecoders<GetUserPasskeyError> = [
      { on: 400, kind: "errorResponse", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 401, kind: "errorResponse2", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 404, kind: "errorResponse3", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 413, kind: "errorResponse4", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 500, kind: "errorResponse5", decode: { kind: "json", schema: errorResponseSchema } },
    ];
  }

  export type ReenrollPasskeyRequest = {
    id: string;
    body: V1UsersReenrollRequest;
  };

  export class ReenrollPasskeyError extends ApiError {
    declare readonly payload:
      | Declared<"errorResponse", ErrorResponse>
      | Declared<"errorResponse2", ErrorResponse>
      | Declared<"errorResponse3", ErrorResponse>
      | Declared<"errorResponse4", ErrorResponse>
      | Declared<"errorResponse5", ErrorResponse>
      | Undeclared;

    static readonly errors: ErrorDecoders<ReenrollPasskeyError> = [
      { on: 400, kind: "errorResponse", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 401, kind: "errorResponse2", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 404, kind: "errorResponse3", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 413, kind: "errorResponse4", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 500, kind: "errorResponse5", decode: { kind: "json", schema: errorResponseSchema } },
    ];
  }
}
