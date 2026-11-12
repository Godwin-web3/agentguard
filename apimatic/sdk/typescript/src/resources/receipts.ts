import type { AuthSchemes } from "../auth-schemes.js";
import { ApiError, type Declared, type Undeclared } from "../core/api-error.js";
import type { ApiPromise } from "../core/api-promise.js";
import type { RequestOptions } from "../core/api-request.js";
import { noneAuth } from "../core/auth/schemes.js";
import type { RawClient } from "../core/raw-client.js";
import type { ErrorDecoders } from "../core/response-decoder.js";
import * as s from "../core/validation/index.js";
import { errorResponseSchema, type ErrorResponse } from "../models/error-response.js";
import { receiptEnvelopeSchema, type ReceiptEnvelope } from "../models/receipt-envelope.js";
import { receiptSummarySchema, type ReceiptSummary } from "../models/receipt-summary.js";
import type { Servers } from "../servers.js";

/**
 * Signed Proof-of-Intent receipts for captured payments
 */
export class Receipts {
  readonly #rawClient: RawClient;
  readonly #servers: Servers;
  readonly #auth: AuthSchemes;

  constructor(rawClient: RawClient, servers: Servers, auth: AuthSchemes) {
    this.#rawClient = rawClient;
    this.#servers = servers;
    this.#auth = auth;
  }

  /**
   * Get payment receipt
   *
   * @remarks
   * Receipt for a payment
   *
   * @returns OK
   *
   * @throws {@link Receipts.GetPaymentReceiptError} when the API answers with an error status —
   * narrow on `err.payload.kind`
   *
   * @throws {@link AgentGuardApiError} when no usable response was produced: a connection failure,
   * a timeout, a body that would not decode, a value that would not encode, or a credential that
   * could not be obtained
   */
  getPaymentReceipt(
    request: Receipts.GetPaymentReceiptRequest,
    options?: RequestOptions,
  ): ApiPromise<ReceiptEnvelope, Receipts.GetPaymentReceiptError> {
    return this.#rawClient.execute(
      {
        method: "GET",
        urlTemplate: this.#servers.default("/v1/payments/{id}/receipt"),
        auth: this.#auth.admin,
        pathParams: [{ name: "id", value: request.id, schema: s.string() }],
        query: [],
        headers: [],
        body: { kind: "empty" },
      },
      {
        success: { kind: "json", schema: receiptEnvelopeSchema },
        errorFactory: Receipts.GetPaymentReceiptError,
      },
      options,
    );
  }

  /**
   * Get public receipt
   *
   * @remarks
   * Public receipt lookup (only when AGENTGUARD_PUBLIC_RECEIPTS=1)
   *
   * @returns OK
   *
   * @throws {@link Receipts.GetPublicReceiptError} when the API answers with an error status —
   * narrow on `err.payload.kind`
   *
   * @throws {@link AgentGuardApiError} when no usable response was produced: a connection failure,
   * a timeout, a body that would not decode, a value that would not encode, or a credential that
   * could not be obtained
   */
  getPublicReceipt(
    request: Receipts.GetPublicReceiptRequest,
    options?: RequestOptions,
  ): ApiPromise<ReceiptEnvelope, Receipts.GetPublicReceiptError> {
    return this.#rawClient.execute(
      {
        method: "GET",
        urlTemplate: this.#servers.default("/v1/public/receipts/{id}"),
        auth: noneAuth,
        pathParams: [{ name: "id", value: request.id, schema: s.string() }],
        query: [],
        headers: [],
        body: { kind: "empty" },
      },
      {
        success: { kind: "json", schema: receiptEnvelopeSchema },
        errorFactory: Receipts.GetPublicReceiptError,
      },
      options,
    );
  }

  /**
   * Get receipt
   *
   * @remarks
   * Receipt by id
   *
   * @returns OK
   *
   * @throws {@link Receipts.GetReceiptError} when the API answers with an error status — narrow on
   * `err.payload.kind`
   *
   * @throws {@link AgentGuardApiError} when no usable response was produced: a connection failure,
   * a timeout, a body that would not decode, a value that would not encode, or a credential that
   * could not be obtained
   */
  getReceipt(
    request: Receipts.GetReceiptRequest,
    options?: RequestOptions,
  ): ApiPromise<ReceiptEnvelope, Receipts.GetReceiptError> {
    return this.#rawClient.execute(
      {
        method: "GET",
        urlTemplate: this.#servers.default("/v1/receipts/{id}"),
        auth: this.#auth.admin,
        pathParams: [{ name: "id", value: request.id, schema: s.string() }],
        query: [],
        headers: [],
        body: { kind: "empty" },
      },
      {
        success: { kind: "json", schema: receiptEnvelopeSchema },
        errorFactory: Receipts.GetReceiptError,
      },
      options,
    );
  }

  /**
   * List receipts
   *
   * @remarks
   * List receipts
   *
   * @returns OK
   *
   * @throws {@link Receipts.ListReceiptsError} when the API answers with an error status — narrow
   * on `err.payload.kind`
   *
   * @throws {@link AgentGuardApiError} when no usable response was produced: a connection failure,
   * a timeout, a body that would not decode, a value that would not encode, or a credential that
   * could not be obtained
   */
  listReceipts(
    request: Receipts.ListReceiptsRequest = {},
    options?: RequestOptions,
  ): ApiPromise<ReceiptSummary[], Receipts.ListReceiptsError> {
    return this.#rawClient.execute(
      {
        method: "GET",
        urlTemplate: this.#servers.default("/v1/receipts"),
        auth: this.#auth.admin,
        pathParams: [],
        query: [{ name: "limit", value: request.limit, schema: s.optional(s.string()) }],
        headers: [],
        body: { kind: "empty" },
      },
      {
        success: { kind: "json", schema: s.array(s.lazy(() => receiptSummarySchema)) },
        errorFactory: Receipts.ListReceiptsError,
      },
      options,
    );
  }
}

export namespace Receipts {
  export type GetPaymentReceiptRequest = {
    id: string;
  };

  export class GetPaymentReceiptError extends ApiError {
    declare readonly payload:
      | Declared<"errorResponse", ErrorResponse>
      | Declared<"errorResponse2", ErrorResponse>
      | Declared<"errorResponse3", ErrorResponse>
      | Declared<"errorResponse4", ErrorResponse>
      | Declared<"errorResponse5", ErrorResponse>
      | Undeclared;

    static readonly errors: ErrorDecoders<GetPaymentReceiptError> = [
      { on: 400, kind: "errorResponse", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 401, kind: "errorResponse2", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 404, kind: "errorResponse3", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 413, kind: "errorResponse4", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 500, kind: "errorResponse5", decode: { kind: "json", schema: errorResponseSchema } },
    ];
  }

  export type GetPublicReceiptRequest = {
    id: string;
  };

  export class GetPublicReceiptError extends ApiError {
    declare readonly payload:
      | Declared<"errorResponse", ErrorResponse>
      | Declared<"errorResponse2", ErrorResponse>
      | Declared<"errorResponse3", ErrorResponse>
      | Declared<"errorResponse4", ErrorResponse>
      | Undeclared;

    static readonly errors: ErrorDecoders<GetPublicReceiptError> = [
      { on: 400, kind: "errorResponse", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 404, kind: "errorResponse2", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 413, kind: "errorResponse3", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 500, kind: "errorResponse4", decode: { kind: "json", schema: errorResponseSchema } },
    ];
  }

  export type GetReceiptRequest = {
    id: string;
  };

  export class GetReceiptError extends ApiError {
    declare readonly payload:
      | Declared<"errorResponse", ErrorResponse>
      | Declared<"errorResponse2", ErrorResponse>
      | Declared<"errorResponse3", ErrorResponse>
      | Declared<"errorResponse4", ErrorResponse>
      | Declared<"errorResponse5", ErrorResponse>
      | Undeclared;

    static readonly errors: ErrorDecoders<GetReceiptError> = [
      { on: 400, kind: "errorResponse", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 401, kind: "errorResponse2", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 404, kind: "errorResponse3", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 413, kind: "errorResponse4", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 500, kind: "errorResponse5", decode: { kind: "json", schema: errorResponseSchema } },
    ];
  }

  export type ListReceiptsRequest = {
    /** Default 100 */
    limit?: string;
  };

  export class ListReceiptsError extends ApiError {
    declare readonly payload:
      | Declared<"errorResponse", ErrorResponse>
      | Declared<"errorResponse2", ErrorResponse>
      | Declared<"errorResponse3", ErrorResponse>
      | Declared<"errorResponse4", ErrorResponse>
      | Declared<"errorResponse5", ErrorResponse>
      | Undeclared;

    static readonly errors: ErrorDecoders<ListReceiptsError> = [
      { on: 400, kind: "errorResponse", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 401, kind: "errorResponse2", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 404, kind: "errorResponse3", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 413, kind: "errorResponse4", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 500, kind: "errorResponse5", decode: { kind: "json", schema: errorResponseSchema } },
    ];
  }
}
