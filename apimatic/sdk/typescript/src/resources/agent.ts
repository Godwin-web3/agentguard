import type { AuthSchemes } from "../auth-schemes.js";
import { ApiError, type Declared, type Undeclared } from "../core/api-error.js";
import type { ApiPromise } from "../core/api-promise.js";
import type { RequestOptions } from "../core/api-request.js";
import type { RawClient } from "../core/raw-client.js";
import type { ErrorDecoders } from "../core/response-decoder.js";
import { uuid } from "../core/uuid.js";
import * as s from "../core/validation/index.js";
import { agentMandateSchema, type AgentMandate } from "../models/agent-mandate.js";
import { errorResponseSchema, type ErrorResponse } from "../models/error-response.js";
import { paymentDecisionSchema, type PaymentDecision } from "../models/payment-decision.js";
import { productSearchResultSchema, type ProductSearchResult } from "../models/product-search-result.js";
import { receiptEnvelopeSchema, type ReceiptEnvelope } from "../models/receipt-envelope.js";
import {
  v1AgentPaymentsRequestSchema,
  type V1AgentPaymentsRequest,
} from "../models/v1-agent-payments-request.js";
import {
  v1AgentProductsSearchRequestSchema,
  type V1AgentProductsSearchRequest,
} from "../models/v1-agent-products-search-request.js";
import type { Servers } from "../servers.js";

/**
 * Calls an agent makes with its own key: product search, payments, receipts
 */
export class Agent {
  readonly #rawClient: RawClient;
  readonly #servers: Servers;
  readonly #auth: AuthSchemes;

  constructor(rawClient: RawClient, servers: Servers, auth: AuthSchemes) {
    this.#rawClient = rawClient;
    this.#servers = servers;
    this.#auth = auth;
  }

  /**
   * Get agent mandate
   *
   * @remarks
   * The agent's own mandate, status and spend
   *
   * @returns OK
   *
   * @throws {@link Agent.GetAgentMandateError} when the API answers with an error status — narrow
   * on `err.payload.kind`
   *
   * @throws {@link AgentGuardApiError} when no usable response was produced: a connection failure,
   * a timeout, a body that would not decode, a value that would not encode, or a credential that
   * could not be obtained
   */
  getAgentMandate(
    request: Agent.GetAgentMandateRequest,
    options?: RequestOptions,
  ): ApiPromise<AgentMandate, Agent.GetAgentMandateError> {
    return this.#rawClient.execute(
      {
        method: "GET",
        urlTemplate: this.#servers.default("/v1/agent/mandates/{id}"),
        auth: this.#auth.agent,
        pathParams: [{ name: "id", value: request.id, schema: s.string() }],
        query: [],
        headers: [],
        body: { kind: "empty" },
      },
      {
        success: { kind: "json", schema: agentMandateSchema },
        errorFactory: Agent.GetAgentMandateError,
      },
      options,
    );
  }

  /**
   * Get agent payment
   *
   * @remarks
   * Payment status (the calling agent's own only)
   *
   * @returns OK
   *
   * @throws {@link Agent.GetAgentPaymentError} when the API answers with an error status — narrow
   * on `err.payload.kind`
   *
   * @throws {@link AgentGuardApiError} when no usable response was produced: a connection failure,
   * a timeout, a body that would not decode, a value that would not encode, or a credential that
   * could not be obtained
   */
  getAgentPayment(
    request: Agent.GetAgentPaymentRequest,
    options?: RequestOptions,
  ): ApiPromise<PaymentDecision, Agent.GetAgentPaymentError> {
    return this.#rawClient.execute(
      {
        method: "GET",
        urlTemplate: this.#servers.default("/v1/agent/payments/{id}"),
        auth: this.#auth.agent,
        pathParams: [{ name: "id", value: request.id, schema: s.string() }],
        query: [],
        headers: [],
        body: { kind: "empty" },
      },
      {
        success: { kind: "json", schema: paymentDecisionSchema },
        errorFactory: Agent.GetAgentPaymentError,
      },
      options,
    );
  }

  /**
   * Get agent payment receipt
   *
   * @remarks
   * Proof-of-Intent receipt for a captured payment
   *
   * @returns OK
   *
   * @throws {@link Agent.GetAgentPaymentReceiptError} when the API answers with an error status —
   * narrow on `err.payload.kind`
   *
   * @throws {@link AgentGuardApiError} when no usable response was produced: a connection failure,
   * a timeout, a body that would not decode, a value that would not encode, or a credential that
   * could not be obtained
   */
  getAgentPaymentReceipt(
    request: Agent.GetAgentPaymentReceiptRequest,
    options?: RequestOptions,
  ): ApiPromise<ReceiptEnvelope, Agent.GetAgentPaymentReceiptError> {
    return this.#rawClient.execute(
      {
        method: "GET",
        urlTemplate: this.#servers.default("/v1/agent/payments/{id}/receipt"),
        auth: this.#auth.agent,
        pathParams: [{ name: "id", value: request.id, schema: s.string() }],
        query: [],
        headers: [],
        body: { kind: "empty" },
      },
      {
        success: { kind: "json", schema: receiptEnvelopeSchema },
        errorFactory: Agent.GetAgentPaymentReceiptError,
      },
      options,
    );
  }

  /**
   * Propose a payment
   *
   * @remarks
   * Propose a payment (30/min per agent; 429 above)
   *
   * @returns OK
   *
   * @throws {@link Agent.ProposePaymentError} when the API answers with an error status — narrow on
   * `err.payload.kind`
   *
   * @throws {@link AgentGuardApiError} when no usable response was produced: a connection failure,
   * a timeout, a body that would not decode, a value that would not encode, or a credential that
   * could not be obtained
   */
  proposePayment(
    request: Agent.ProposePaymentRequest,
    options?: RequestOptions,
  ): ApiPromise<PaymentDecision, Agent.ProposePaymentError> {
    return this.#rawClient.execute(
      {
        method: "POST",
        urlTemplate: this.#servers.default("/v1/agent/payments"),
        auth: this.#auth.agent,
        pathParams: [],
        query: [],
        headers: [{ name: "Idempotency-Key", value: uuid(), schema: s.string() }],
        body: { kind: "json", value: request.body, schema: v1AgentPaymentsRequestSchema },
      },
      {
        success: { kind: "json", schema: paymentDecisionSchema },
        errorFactory: Agent.ProposePaymentError,
      },
      options,
    );
  }

  /**
   * Search products
   *
   * @remarks
   * Search the Channel3 product catalog within the mandate's currency and remaining budget
   * (discovery only; never pays)
   *
   * @returns OK
   *
   * @throws {@link Agent.SearchProductsError} when the API answers with an error status — narrow on
   * `err.payload.kind`
   *
   * @throws {@link AgentGuardApiError} when no usable response was produced: a connection failure,
   * a timeout, a body that would not decode, a value that would not encode, or a credential that
   * could not be obtained
   */
  searchProducts(
    request: Agent.SearchProductsRequest,
    options?: RequestOptions,
  ): ApiPromise<ProductSearchResult, Agent.SearchProductsError> {
    return this.#rawClient.execute(
      {
        method: "POST",
        urlTemplate: this.#servers.default("/v1/agent/products/search"),
        auth: this.#auth.agent,
        pathParams: [],
        query: [],
        headers: [{ name: "Idempotency-Key", value: uuid(), schema: s.string() }],
        body: { kind: "json", value: request.body, schema: v1AgentProductsSearchRequestSchema },
      },
      {
        success: { kind: "json", schema: productSearchResultSchema },
        errorFactory: Agent.SearchProductsError,
      },
      options,
    );
  }
}

export namespace Agent {
  export type GetAgentMandateRequest = {
    id: string;
  };

  export class GetAgentMandateError extends ApiError {
    declare readonly payload:
      | Declared<"errorResponse", ErrorResponse>
      | Declared<"errorResponse2", ErrorResponse>
      | Declared<"errorResponse3", ErrorResponse>
      | Declared<"errorResponse4", ErrorResponse>
      | Declared<"errorResponse5", ErrorResponse>
      | Undeclared;

    static readonly errors: ErrorDecoders<GetAgentMandateError> = [
      { on: 400, kind: "errorResponse", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 401, kind: "errorResponse2", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 404, kind: "errorResponse3", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 413, kind: "errorResponse4", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 500, kind: "errorResponse5", decode: { kind: "json", schema: errorResponseSchema } },
    ];
  }

  export type GetAgentPaymentRequest = {
    id: string;
  };

  export class GetAgentPaymentError extends ApiError {
    declare readonly payload:
      | Declared<"errorResponse", ErrorResponse>
      | Declared<"errorResponse2", ErrorResponse>
      | Declared<"errorResponse3", ErrorResponse>
      | Declared<"errorResponse4", ErrorResponse>
      | Declared<"errorResponse5", ErrorResponse>
      | Undeclared;

    static readonly errors: ErrorDecoders<GetAgentPaymentError> = [
      { on: 400, kind: "errorResponse", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 401, kind: "errorResponse2", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 404, kind: "errorResponse3", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 413, kind: "errorResponse4", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 500, kind: "errorResponse5", decode: { kind: "json", schema: errorResponseSchema } },
    ];
  }

  export type GetAgentPaymentReceiptRequest = {
    id: string;
  };

  export class GetAgentPaymentReceiptError extends ApiError {
    declare readonly payload:
      | Declared<"errorResponse", ErrorResponse>
      | Declared<"errorResponse2", ErrorResponse>
      | Declared<"errorResponse3", ErrorResponse>
      | Declared<"errorResponse4", ErrorResponse>
      | Declared<"errorResponse5", ErrorResponse>
      | Undeclared;

    static readonly errors: ErrorDecoders<GetAgentPaymentReceiptError> = [
      { on: 400, kind: "errorResponse", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 401, kind: "errorResponse2", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 404, kind: "errorResponse3", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 413, kind: "errorResponse4", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 500, kind: "errorResponse5", decode: { kind: "json", schema: errorResponseSchema } },
    ];
  }

  export type ProposePaymentRequest = {
    body: V1AgentPaymentsRequest;
  };

  export class ProposePaymentError extends ApiError {
    declare readonly payload:
      | Declared<"errorResponse", ErrorResponse>
      | Declared<"errorResponse2", ErrorResponse>
      | Declared<"errorResponse3", ErrorResponse>
      | Declared<"errorResponse4", ErrorResponse>
      | Declared<"errorResponse5", ErrorResponse>
      | Declared<"errorResponse6", ErrorResponse>
      | Declared<"errorResponse7", ErrorResponse>
      | Undeclared;

    static readonly errors: ErrorDecoders<ProposePaymentError> = [
      { on: 400, kind: "errorResponse", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 401, kind: "errorResponse2", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 404, kind: "errorResponse3", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 413, kind: "errorResponse4", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 429, kind: "errorResponse5", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 500, kind: "errorResponse6", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 503, kind: "errorResponse7", decode: { kind: "json", schema: errorResponseSchema } },
    ];
  }

  export type SearchProductsRequest = {
    body: V1AgentProductsSearchRequest;
  };

  export class SearchProductsError extends ApiError {
    declare readonly payload:
      | Declared<"errorResponse", ErrorResponse>
      | Declared<"errorResponse2", ErrorResponse>
      | Declared<"errorResponse3", ErrorResponse>
      | Declared<"errorResponse4", ErrorResponse>
      | Declared<"errorResponse5", ErrorResponse>
      | Undeclared;

    static readonly errors: ErrorDecoders<SearchProductsError> = [
      { on: 400, kind: "errorResponse", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 401, kind: "errorResponse2", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 404, kind: "errorResponse3", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 413, kind: "errorResponse4", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 500, kind: "errorResponse5", decode: { kind: "json", schema: errorResponseSchema } },
    ];
  }
}
