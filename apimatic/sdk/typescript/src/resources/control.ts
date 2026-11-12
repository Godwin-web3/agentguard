import type { AuthSchemes } from "../auth-schemes.js";
import { ApiError, type Declared, type Undeclared } from "../core/api-error.js";
import type { ApiPromise } from "../core/api-promise.js";
import type { RequestOptions } from "../core/api-request.js";
import type { RawClient } from "../core/raw-client.js";
import type { ErrorDecoders } from "../core/response-decoder.js";
import { uuid } from "../core/uuid.js";
import * as s from "../core/validation/index.js";
import { errorResponseSchema, type ErrorResponse } from "../models/error-response.js";
import { pauseStateSchema, type PauseState } from "../models/pause-state.js";
import {
  v1ControlPauseRequestSchema,
  type V1ControlPauseRequest,
} from "../models/v1-control-pause-request.js";
import {
  v1ControlResumeRequestSchema,
  type V1ControlResumeRequest,
} from "../models/v1-control-resume-request.js";
import type { Servers } from "../servers.js";

/**
 * Operator kill-switch
 */
export class Control {
  readonly #rawClient: RawClient;
  readonly #servers: Servers;
  readonly #auth: AuthSchemes;

  constructor(rawClient: RawClient, servers: Servers, auth: AuthSchemes) {
    this.#rawClient = rawClient;
    this.#servers = servers;
    this.#auth = auth;
  }

  /**
   * Get pause state
   *
   * @remarks
   * Kill-switch state
   *
   * @returns OK
   *
   * @throws {@link Control.GetPauseStateError} when the API answers with an error status — narrow
   * on `err.payload.kind`
   *
   * @throws {@link AgentGuardApiError} when no usable response was produced: a connection failure,
   * a timeout, a body that would not decode, a value that would not encode, or a credential that
   * could not be obtained
   */
  getPauseState(options?: RequestOptions): ApiPromise<PauseState, Control.GetPauseStateError> {
    return this.#rawClient.execute(
      {
        method: "GET",
        urlTemplate: this.#servers.default("/v1/control/pause"),
        auth: this.#auth.admin,
        pathParams: [],
        query: [],
        headers: [],
        body: { kind: "empty" },
      },
      {
        success: { kind: "json", schema: pauseStateSchema },
        errorFactory: Control.GetPauseStateError,
      },
      options,
    );
  }

  /**
   * Pause
   *
   * @remarks
   * Block every new proposal and approval (503)
   *
   * @returns OK
   *
   * @throws {@link Control.PauseError} when the API answers with an error status — narrow on
   * `err.payload.kind`
   *
   * @throws {@link AgentGuardApiError} when no usable response was produced: a connection failure,
   * a timeout, a body that would not decode, a value that would not encode, or a credential that
   * could not be obtained
   */
  pause(
    request: Control.PauseRequest = {},
    options?: RequestOptions,
  ): ApiPromise<Record<string, unknown>, Control.PauseError> {
    return this.#rawClient.execute(
      {
        method: "POST",
        urlTemplate: this.#servers.default("/v1/control/pause"),
        auth: this.#auth.admin,
        pathParams: [],
        query: [],
        headers: [{ name: "Idempotency-Key", value: uuid(), schema: s.string() }],
        body: {
          kind: "json",
          value: request.body,
          schema: s.optional(s.lazy(() => v1ControlPauseRequestSchema)),
        },
      },
      {
        success: { kind: "json", schema: s.record(s.string(), s.unknown()) },
        errorFactory: Control.PauseError,
      },
      options,
    );
  }

  /**
   * Resume
   *
   * @remarks
   * Lift the kill-switch
   *
   * @returns OK
   *
   * @throws {@link Control.ResumeError} when the API answers with an error status — narrow on
   * `err.payload.kind`
   *
   * @throws {@link AgentGuardApiError} when no usable response was produced: a connection failure,
   * a timeout, a body that would not decode, a value that would not encode, or a credential that
   * could not be obtained
   */
  resume(
    request: Control.ResumeRequest = {},
    options?: RequestOptions,
  ): ApiPromise<Record<string, unknown>, Control.ResumeError> {
    return this.#rawClient.execute(
      {
        method: "POST",
        urlTemplate: this.#servers.default("/v1/control/resume"),
        auth: this.#auth.admin,
        pathParams: [],
        query: [],
        headers: [{ name: "Idempotency-Key", value: uuid(), schema: s.string() }],
        body: {
          kind: "json",
          value: request.body,
          schema: s.optional(s.lazy(() => v1ControlResumeRequestSchema)),
        },
      },
      {
        success: { kind: "json", schema: s.record(s.string(), s.unknown()) },
        errorFactory: Control.ResumeError,
      },
      options,
    );
  }
}

export namespace Control {
  export class GetPauseStateError extends ApiError {
    declare readonly payload:
      | Declared<"errorResponse", ErrorResponse>
      | Declared<"errorResponse2", ErrorResponse>
      | Declared<"errorResponse3", ErrorResponse>
      | Declared<"errorResponse4", ErrorResponse>
      | Declared<"errorResponse5", ErrorResponse>
      | Undeclared;

    static readonly errors: ErrorDecoders<GetPauseStateError> = [
      { on: 400, kind: "errorResponse", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 401, kind: "errorResponse2", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 404, kind: "errorResponse3", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 413, kind: "errorResponse4", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 500, kind: "errorResponse5", decode: { kind: "json", schema: errorResponseSchema } },
    ];
  }

  export type PauseRequest = {
    body?: V1ControlPauseRequest;
  };

  export class PauseError extends ApiError {
    declare readonly payload:
      | Declared<"errorResponse", ErrorResponse>
      | Declared<"errorResponse2", ErrorResponse>
      | Declared<"errorResponse3", ErrorResponse>
      | Declared<"errorResponse4", ErrorResponse>
      | Declared<"errorResponse5", ErrorResponse>
      | Undeclared;

    static readonly errors: ErrorDecoders<PauseError> = [
      { on: 400, kind: "errorResponse", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 401, kind: "errorResponse2", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 404, kind: "errorResponse3", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 413, kind: "errorResponse4", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 500, kind: "errorResponse5", decode: { kind: "json", schema: errorResponseSchema } },
    ];
  }

  export type ResumeRequest = {
    body?: V1ControlResumeRequest;
  };

  export class ResumeError extends ApiError {
    declare readonly payload:
      | Declared<"errorResponse", ErrorResponse>
      | Declared<"errorResponse2", ErrorResponse>
      | Declared<"errorResponse3", ErrorResponse>
      | Declared<"errorResponse4", ErrorResponse>
      | Declared<"errorResponse5", ErrorResponse>
      | Undeclared;

    static readonly errors: ErrorDecoders<ResumeError> = [
      { on: 400, kind: "errorResponse", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 401, kind: "errorResponse2", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 404, kind: "errorResponse3", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 413, kind: "errorResponse4", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 500, kind: "errorResponse5", decode: { kind: "json", schema: errorResponseSchema } },
    ];
  }
}
