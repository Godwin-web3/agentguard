import type { AuthSchemes } from "../auth-schemes.js";
import { ApiError, type Declared, type Undeclared } from "../core/api-error.js";
import type { ApiPromise } from "../core/api-promise.js";
import type { RequestOptions } from "../core/api-request.js";
import type { RawClient } from "../core/raw-client.js";
import type { ErrorDecoders } from "../core/response-decoder.js";
import { uuid } from "../core/uuid.js";
import * as s from "../core/validation/index.js";
import { errorResponseSchema, type ErrorResponse } from "../models/error-response.js";
import { productSearchResultSchema, type ProductSearchResult } from "../models/product-search-result.js";
import {
  v1ProductsSearchRequestSchema,
  type V1ProductsSearchRequest,
} from "../models/v1-products-search-request.js";
import type { Servers } from "../servers.js";

/**
 * Channel3 product search for the owner
 */
export class Catalog {
  readonly #rawClient: RawClient;
  readonly #servers: Servers;
  readonly #auth: AuthSchemes;

  constructor(rawClient: RawClient, servers: Servers, auth: AuthSchemes) {
    this.#rawClient = rawClient;
    this.#servers = servers;
    this.#auth = auth;
  }

  /**
   * Get product search status
   *
   * @remarks
   * Whether Channel3 product search is configured (CHANNEL3_API_KEY)
   *
   * @returns OK
   *
   * @throws {@link Catalog.GetProductSearchStatusError} when the API answers with an error status —
   * narrow on `err.payload.kind`
   *
   * @throws {@link AgentGuardApiError} when no usable response was produced: a connection failure,
   * a timeout, a body that would not decode, a value that would not encode, or a credential that
   * could not be obtained
   */
  getProductSearchStatus(
    options?: RequestOptions,
  ): ApiPromise<Record<string, unknown>, Catalog.GetProductSearchStatusError> {
    return this.#rawClient.execute(
      {
        method: "GET",
        urlTemplate: this.#servers.default("/v1/products/status"),
        auth: this.#auth.admin,
        pathParams: [],
        query: [],
        headers: [],
        body: { kind: "empty" },
      },
      {
        success: { kind: "json", schema: s.record(s.string(), s.unknown()) },
        errorFactory: Catalog.GetProductSearchStatusError,
      },
      options,
    );
  }

  /**
   * Search products for mandate
   *
   * @remarks
   * Owner view of the same Channel3 search, with an advisory mandate-fit check per product
   *
   * @returns OK
   *
   * @throws {@link Catalog.SearchProductsForMandateError} when the API answers with an error status
   * — narrow on `err.payload.kind`
   *
   * @throws {@link AgentGuardApiError} when no usable response was produced: a connection failure,
   * a timeout, a body that would not decode, a value that would not encode, or a credential that
   * could not be obtained
   */
  searchProductsForMandate(
    request: Catalog.SearchProductsForMandateRequest,
    options?: RequestOptions,
  ): ApiPromise<ProductSearchResult, Catalog.SearchProductsForMandateError> {
    return this.#rawClient.execute(
      {
        method: "POST",
        urlTemplate: this.#servers.default("/v1/products/search"),
        auth: this.#auth.admin,
        pathParams: [],
        query: [],
        headers: [{ name: "Idempotency-Key", value: uuid(), schema: s.string() }],
        body: { kind: "json", value: request.body, schema: v1ProductsSearchRequestSchema },
      },
      {
        success: { kind: "json", schema: productSearchResultSchema },
        errorFactory: Catalog.SearchProductsForMandateError,
      },
      options,
    );
  }
}

export namespace Catalog {
  export class GetProductSearchStatusError extends ApiError {
    declare readonly payload:
      | Declared<"errorResponse", ErrorResponse>
      | Declared<"errorResponse2", ErrorResponse>
      | Declared<"errorResponse3", ErrorResponse>
      | Declared<"errorResponse4", ErrorResponse>
      | Declared<"errorResponse5", ErrorResponse>
      | Undeclared;

    static readonly errors: ErrorDecoders<GetProductSearchStatusError> = [
      { on: 400, kind: "errorResponse", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 401, kind: "errorResponse2", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 404, kind: "errorResponse3", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 413, kind: "errorResponse4", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 500, kind: "errorResponse5", decode: { kind: "json", schema: errorResponseSchema } },
    ];
  }

  export type SearchProductsForMandateRequest = {
    body: V1ProductsSearchRequest;
  };

  export class SearchProductsForMandateError extends ApiError {
    declare readonly payload:
      | Declared<"errorResponse", ErrorResponse>
      | Declared<"errorResponse2", ErrorResponse>
      | Declared<"errorResponse3", ErrorResponse>
      | Declared<"errorResponse4", ErrorResponse>
      | Declared<"errorResponse5", ErrorResponse>
      | Undeclared;

    static readonly errors: ErrorDecoders<SearchProductsForMandateError> = [
      { on: 400, kind: "errorResponse", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 401, kind: "errorResponse2", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 404, kind: "errorResponse3", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 413, kind: "errorResponse4", decode: { kind: "json", schema: errorResponseSchema } },
      { on: 500, kind: "errorResponse5", decode: { kind: "json", schema: errorResponseSchema } },
    ];
  }
}
