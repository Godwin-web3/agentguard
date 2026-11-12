from __future__ import annotations

from typing import Any
from uuid import UUID, uuid4

from ..auth import AsyncAuthSchemes, AuthSchemes
from ..core import (
    ApiResult,
    AsyncRawClient,
    RawClient,
    RequestOptionsOrDict,
    SecuredRawResponse,
    async_json_decoder,
    json_body,
    json_decoder,
    param,
    unwrap,
)
from ..errors.cancel_recovery_error import CancelRecoveryErrorBody, cancel_recovery_error_mapper
from ..errors.create_enrollment_link_error import CreateEnrollmentLinkErrorBody, create_enrollment_link_error_mapper
from ..errors.enroll_passkey_error import EnrollPasskeyErrorBody, enroll_passkey_error_mapper
from ..errors.get_enrollment_options_error import GetEnrollmentOptionsErrorBody, get_enrollment_options_error_mapper
from ..errors.get_recovery_cancel_options_error import (
    GetRecoveryCancelOptionsErrorBody,
    get_recovery_cancel_options_error_mapper,
)
from ..errors.get_recovery_state_error import GetRecoveryStateErrorBody, get_recovery_state_error_mapper
from ..errors.get_reenrollment_options_error import (
    GetReenrollmentOptionsErrorBody,
    get_reenrollment_options_error_mapper,
)
from ..errors.get_user_passkey_error import GetUserPasskeyErrorBody, get_user_passkey_error_mapper
from ..errors.reenroll_passkey_error import ReenrollPasskeyErrorBody, reenroll_passkey_error_mapper
from ..models.v1_enroll_options_request import V1EnrollOptionsRequest, V1EnrollOptionsRequestDict
from ..models.v1_enroll_request import V1EnrollRequest, V1EnrollRequestDict
from ..models.v1_users_enrollments_request import V1UsersEnrollmentsRequest, V1UsersEnrollmentsRequestDict
from ..models.v1_users_recovery_cancel_request import V1UsersRecoveryCancelRequest, V1UsersRecoveryCancelRequestDict
from ..models.v1_users_reenroll_request import V1UsersReenrollRequest, V1UsersReenrollRequestDict
from ..server.server import Server


class Passkeys:
    def __init__(self, client: RawClient, server: Server, auth: AuthSchemes) -> None:
        self._with_raw_response = PasskeysWithRawResponse(client, server, auth)

    def cancel_recovery(
        self,
        id_: str,
        body: V1UsersRecoveryCancelRequest | V1UsersRecoveryCancelRequestDict,
        *,
        request_options: RequestOptionsOrDict | None = None,
    ) -> Any:
        """Cancel a pending recovery

        Args:
            id_: Value sent with the request.
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Not found Body over 256 KB Internal error ``error`` is ``ErrorResponse |
                RawError``."""
        return unwrap(self._with_raw_response.cancel_recovery(id_, body, request_options=request_options))

    def create_enrollment_link(
        self,
        id_: str,
        *,
        body: V1UsersEnrollmentsRequest | V1UsersEnrollmentsRequestDict | None = None,
        request_options: RequestOptionsOrDict | None = None,
    ) -> Any:
        """Issue a single-use enrollment link (15 min default)

        Args:
            id_: Value sent with the request.
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(self._with_raw_response.create_enrollment_link(id_, body=body, request_options=request_options))

    def enroll_passkey(
        self, body: V1EnrollRequest | V1EnrollRequestDict, *, request_options: RequestOptionsOrDict | None = None
    ) -> Any:
        """Redeem step 2: register the passkey

        Args:
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Not found Body over 256 KB Internal error ``error`` is ``ErrorResponse |
                RawError``."""
        return unwrap(self._with_raw_response.enroll_passkey(body, request_options=request_options))

    def get_enrollment_options(
        self,
        body: V1EnrollOptionsRequest | V1EnrollOptionsRequestDict,
        *,
        request_options: RequestOptionsOrDict | None = None,
    ) -> Any:
        """Redeem step 1: registration options for an enrollment token

        Args:
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Not found Body over 256 KB Internal error ``error`` is ``ErrorResponse |
                RawError``."""
        return unwrap(self._with_raw_response.get_enrollment_options(body, request_options=request_options))

    def get_recovery_cancel_options(self, id_: str, *, request_options: RequestOptionsOrDict | None = None) -> Any:
        """Options to cancel a recovery with the current passkey

        Args:
            id_: Value sent with the request.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Not found Body over 256 KB Internal error ``error`` is ``ErrorResponse |
                RawError``."""
        return unwrap(self._with_raw_response.get_recovery_cancel_options(id_, request_options=request_options))

    def get_recovery_state(self, id_: str, *, request_options: RequestOptionsOrDict | None = None) -> Any:
        """Time-locked recovery state

        Args:
            id_: Value sent with the request.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(self._with_raw_response.get_recovery_state(id_, request_options=request_options))

    def get_reenrollment_options(self, id_: str, *, request_options: RequestOptionsOrDict | None = None) -> Any:
        """Options for replacing a passkey with the current one

        Args:
            id_: Value sent with the request.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(self._with_raw_response.get_reenrollment_options(id_, request_options=request_options))

    def get_user_passkey(self, id_: str, *, request_options: RequestOptionsOrDict | None = None) -> Any:
        """Whether the user has a passkey, and its credential id

        Args:
            id_: Value sent with the request.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(self._with_raw_response.get_user_passkey(id_, request_options=request_options))

    def reenroll_passkey(
        self,
        id_: str,
        body: V1UsersReenrollRequest | V1UsersReenrollRequestDict,
        *,
        request_options: RequestOptionsOrDict | None = None,
    ) -> Any:
        """Mint a re-enrollment token authorized by the current passkey

        Args:
            id_: Value sent with the request.
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(self._with_raw_response.reenroll_passkey(id_, body, request_options=request_options))

    @property
    def with_raw_response(self) -> PasskeysWithRawResponse:
        return self._with_raw_response


class AsyncPasskeys:
    def __init__(self, client: AsyncRawClient, server: Server, auth: AsyncAuthSchemes) -> None:
        self._with_raw_response = AsyncPasskeysWithRawResponse(client, server, auth)

    async def cancel_recovery(
        self,
        id_: str,
        body: V1UsersRecoveryCancelRequest | V1UsersRecoveryCancelRequestDict,
        *,
        request_options: RequestOptionsOrDict | None = None,
    ) -> Any:
        """Cancel a pending recovery

        Args:
            id_: Value sent with the request.
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Not found Body over 256 KB Internal error ``error`` is ``ErrorResponse |
                RawError``."""
        return unwrap(await self._with_raw_response.cancel_recovery(id_, body, request_options=request_options))

    async def create_enrollment_link(
        self,
        id_: str,
        *,
        body: V1UsersEnrollmentsRequest | V1UsersEnrollmentsRequestDict | None = None,
        request_options: RequestOptionsOrDict | None = None,
    ) -> Any:
        """Issue a single-use enrollment link (15 min default)

        Args:
            id_: Value sent with the request.
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(
            await self._with_raw_response.create_enrollment_link(id_, body=body, request_options=request_options)
        )

    async def enroll_passkey(
        self, body: V1EnrollRequest | V1EnrollRequestDict, *, request_options: RequestOptionsOrDict | None = None
    ) -> Any:
        """Redeem step 2: register the passkey

        Args:
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Not found Body over 256 KB Internal error ``error`` is ``ErrorResponse |
                RawError``."""
        return unwrap(await self._with_raw_response.enroll_passkey(body, request_options=request_options))

    async def get_enrollment_options(
        self,
        body: V1EnrollOptionsRequest | V1EnrollOptionsRequestDict,
        *,
        request_options: RequestOptionsOrDict | None = None,
    ) -> Any:
        """Redeem step 1: registration options for an enrollment token

        Args:
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Not found Body over 256 KB Internal error ``error`` is ``ErrorResponse |
                RawError``."""
        return unwrap(await self._with_raw_response.get_enrollment_options(body, request_options=request_options))

    async def get_recovery_cancel_options(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> Any:
        """Options to cancel a recovery with the current passkey

        Args:
            id_: Value sent with the request.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Not found Body over 256 KB Internal error ``error`` is ``ErrorResponse |
                RawError``."""
        return unwrap(await self._with_raw_response.get_recovery_cancel_options(id_, request_options=request_options))

    async def get_recovery_state(self, id_: str, *, request_options: RequestOptionsOrDict | None = None) -> Any:
        """Time-locked recovery state

        Args:
            id_: Value sent with the request.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(await self._with_raw_response.get_recovery_state(id_, request_options=request_options))

    async def get_reenrollment_options(self, id_: str, *, request_options: RequestOptionsOrDict | None = None) -> Any:
        """Options for replacing a passkey with the current one

        Args:
            id_: Value sent with the request.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(await self._with_raw_response.get_reenrollment_options(id_, request_options=request_options))

    async def get_user_passkey(self, id_: str, *, request_options: RequestOptionsOrDict | None = None) -> Any:
        """Whether the user has a passkey, and its credential id

        Args:
            id_: Value sent with the request.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(await self._with_raw_response.get_user_passkey(id_, request_options=request_options))

    async def reenroll_passkey(
        self,
        id_: str,
        body: V1UsersReenrollRequest | V1UsersReenrollRequestDict,
        *,
        request_options: RequestOptionsOrDict | None = None,
    ) -> Any:
        """Mint a re-enrollment token authorized by the current passkey

        Args:
            id_: Value sent with the request.
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            OK

        Raises:
            ApiError: Bad request Missing or wrong bearer token Not found Body over 256 KB Internal error ``error`` is
                ``ErrorResponse | RawError``."""
        return unwrap(await self._with_raw_response.reenroll_passkey(id_, body, request_options=request_options))

    @property
    def with_raw_response(self) -> AsyncPasskeysWithRawResponse:
        return self._with_raw_response


class PasskeysWithRawResponse(SecuredRawResponse[RawClient, Server, AuthSchemes]):
    def cancel_recovery(
        self,
        id_: str,
        body: V1UsersRecoveryCancelRequest | V1UsersRecoveryCancelRequestDict,
        *,
        request_options: RequestOptionsOrDict | None = None,
    ) -> ApiResult[Any, CancelRecoveryErrorBody]:
        """Cancel a pending recovery

        Args:
            id_: Value sent with the request.
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="POST",
            url_template=self._server.default("/v1/users/{id}/recovery/cancel"),
            path_params=[param[str]("id", id_)],
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            body=json_body[V1UsersRecoveryCancelRequest | V1UsersRecoveryCancelRequestDict](body),
            decoder=json_decoder[Any],
            error_mapper=cancel_recovery_error_mapper,
            request_options=request_options,
        )

    def create_enrollment_link(
        self,
        id_: str,
        *,
        body: V1UsersEnrollmentsRequest | V1UsersEnrollmentsRequestDict | None = None,
        request_options: RequestOptionsOrDict | None = None,
    ) -> ApiResult[Any, CreateEnrollmentLinkErrorBody]:
        """Issue a single-use enrollment link (15 min default)

        Args:
            id_: Value sent with the request.
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="POST",
            url_template=self._server.default("/v1/users/{id}/enrollments"),
            path_params=[param[str]("id", id_)],
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            body=json_body[V1UsersEnrollmentsRequest | V1UsersEnrollmentsRequestDict | None](body),
            auth_scheme=self._auth.admin,
            decoder=json_decoder[Any],
            error_mapper=create_enrollment_link_error_mapper,
            request_options=request_options,
        )

    def enroll_passkey(
        self, body: V1EnrollRequest | V1EnrollRequestDict, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[Any, EnrollPasskeyErrorBody]:
        """Redeem step 2: register the passkey

        Args:
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="POST",
            url_template=self._server.default("/v1/enroll"),
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            body=json_body[V1EnrollRequest | V1EnrollRequestDict](body),
            decoder=json_decoder[Any],
            error_mapper=enroll_passkey_error_mapper,
            request_options=request_options,
        )

    def get_enrollment_options(
        self,
        body: V1EnrollOptionsRequest | V1EnrollOptionsRequestDict,
        *,
        request_options: RequestOptionsOrDict | None = None,
    ) -> ApiResult[Any, GetEnrollmentOptionsErrorBody]:
        """Redeem step 1: registration options for an enrollment token

        Args:
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="POST",
            url_template=self._server.default("/v1/enroll/options"),
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            body=json_body[V1EnrollOptionsRequest | V1EnrollOptionsRequestDict](body),
            decoder=json_decoder[Any],
            error_mapper=get_enrollment_options_error_mapper,
            request_options=request_options,
        )

    def get_recovery_cancel_options(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[Any, GetRecoveryCancelOptionsErrorBody]:
        """Options to cancel a recovery with the current passkey

        Args:
            id_: Value sent with the request.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="POST",
            url_template=self._server.default("/v1/users/{id}/recovery/cancel-request"),
            path_params=[param[str]("id", id_)],
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            decoder=json_decoder[Any],
            error_mapper=get_recovery_cancel_options_error_mapper,
            request_options=request_options,
        )

    def get_recovery_state(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[Any, GetRecoveryStateErrorBody]:
        """Time-locked recovery state

        Args:
            id_: Value sent with the request.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="GET",
            url_template=self._server.default("/v1/users/{id}/recovery"),
            path_params=[param[str]("id", id_)],
            auth_scheme=self._auth.admin,
            decoder=json_decoder[Any],
            error_mapper=get_recovery_state_error_mapper,
            request_options=request_options,
        )

    def get_reenrollment_options(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[Any, GetReenrollmentOptionsErrorBody]:
        """Options for replacing a passkey with the current one

        Args:
            id_: Value sent with the request.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="POST",
            url_template=self._server.default("/v1/users/{id}/reenroll-request"),
            path_params=[param[str]("id", id_)],
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            auth_scheme=self._auth.admin,
            decoder=json_decoder[Any],
            error_mapper=get_reenrollment_options_error_mapper,
            request_options=request_options,
        )

    def get_user_passkey(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[Any, GetUserPasskeyErrorBody]:
        """Whether the user has a passkey, and its credential id

        Args:
            id_: Value sent with the request.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="GET",
            url_template=self._server.default("/v1/users/{id}/passkey"),
            path_params=[param[str]("id", id_)],
            auth_scheme=self._auth.admin,
            decoder=json_decoder[Any],
            error_mapper=get_user_passkey_error_mapper,
            request_options=request_options,
        )

    def reenroll_passkey(
        self,
        id_: str,
        body: V1UsersReenrollRequest | V1UsersReenrollRequestDict,
        *,
        request_options: RequestOptionsOrDict | None = None,
    ) -> ApiResult[Any, ReenrollPasskeyErrorBody]:
        """Mint a re-enrollment token authorized by the current passkey

        Args:
            id_: Value sent with the request.
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return self._client.execute(
            http_method="POST",
            url_template=self._server.default("/v1/users/{id}/reenroll"),
            path_params=[param[str]("id", id_)],
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            body=json_body[V1UsersReenrollRequest | V1UsersReenrollRequestDict](body),
            auth_scheme=self._auth.admin,
            decoder=json_decoder[Any],
            error_mapper=reenroll_passkey_error_mapper,
            request_options=request_options,
        )


class AsyncPasskeysWithRawResponse(SecuredRawResponse[AsyncRawClient, Server, AsyncAuthSchemes]):
    async def cancel_recovery(
        self,
        id_: str,
        body: V1UsersRecoveryCancelRequest | V1UsersRecoveryCancelRequestDict,
        *,
        request_options: RequestOptionsOrDict | None = None,
    ) -> ApiResult[Any, CancelRecoveryErrorBody]:
        """Cancel a pending recovery

        Args:
            id_: Value sent with the request.
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="POST",
            url_template=self._server.default("/v1/users/{id}/recovery/cancel"),
            path_params=[param[str]("id", id_)],
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            body=json_body[V1UsersRecoveryCancelRequest | V1UsersRecoveryCancelRequestDict](body),
            decoder=async_json_decoder[Any],
            error_mapper=cancel_recovery_error_mapper,
            request_options=request_options,
        )

    async def create_enrollment_link(
        self,
        id_: str,
        *,
        body: V1UsersEnrollmentsRequest | V1UsersEnrollmentsRequestDict | None = None,
        request_options: RequestOptionsOrDict | None = None,
    ) -> ApiResult[Any, CreateEnrollmentLinkErrorBody]:
        """Issue a single-use enrollment link (15 min default)

        Args:
            id_: Value sent with the request.
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="POST",
            url_template=self._server.default("/v1/users/{id}/enrollments"),
            path_params=[param[str]("id", id_)],
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            body=json_body[V1UsersEnrollmentsRequest | V1UsersEnrollmentsRequestDict | None](body),
            auth_scheme=self._auth.admin,
            decoder=async_json_decoder[Any],
            error_mapper=create_enrollment_link_error_mapper,
            request_options=request_options,
        )

    async def enroll_passkey(
        self, body: V1EnrollRequest | V1EnrollRequestDict, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[Any, EnrollPasskeyErrorBody]:
        """Redeem step 2: register the passkey

        Args:
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="POST",
            url_template=self._server.default("/v1/enroll"),
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            body=json_body[V1EnrollRequest | V1EnrollRequestDict](body),
            decoder=async_json_decoder[Any],
            error_mapper=enroll_passkey_error_mapper,
            request_options=request_options,
        )

    async def get_enrollment_options(
        self,
        body: V1EnrollOptionsRequest | V1EnrollOptionsRequestDict,
        *,
        request_options: RequestOptionsOrDict | None = None,
    ) -> ApiResult[Any, GetEnrollmentOptionsErrorBody]:
        """Redeem step 1: registration options for an enrollment token

        Args:
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="POST",
            url_template=self._server.default("/v1/enroll/options"),
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            body=json_body[V1EnrollOptionsRequest | V1EnrollOptionsRequestDict](body),
            decoder=async_json_decoder[Any],
            error_mapper=get_enrollment_options_error_mapper,
            request_options=request_options,
        )

    async def get_recovery_cancel_options(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[Any, GetRecoveryCancelOptionsErrorBody]:
        """Options to cancel a recovery with the current passkey

        Args:
            id_: Value sent with the request.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="POST",
            url_template=self._server.default("/v1/users/{id}/recovery/cancel-request"),
            path_params=[param[str]("id", id_)],
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            decoder=async_json_decoder[Any],
            error_mapper=get_recovery_cancel_options_error_mapper,
            request_options=request_options,
        )

    async def get_recovery_state(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[Any, GetRecoveryStateErrorBody]:
        """Time-locked recovery state

        Args:
            id_: Value sent with the request.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="GET",
            url_template=self._server.default("/v1/users/{id}/recovery"),
            path_params=[param[str]("id", id_)],
            auth_scheme=self._auth.admin,
            decoder=async_json_decoder[Any],
            error_mapper=get_recovery_state_error_mapper,
            request_options=request_options,
        )

    async def get_reenrollment_options(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[Any, GetReenrollmentOptionsErrorBody]:
        """Options for replacing a passkey with the current one

        Args:
            id_: Value sent with the request.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="POST",
            url_template=self._server.default("/v1/users/{id}/reenroll-request"),
            path_params=[param[str]("id", id_)],
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            auth_scheme=self._auth.admin,
            decoder=async_json_decoder[Any],
            error_mapper=get_reenrollment_options_error_mapper,
            request_options=request_options,
        )

    async def get_user_passkey(
        self, id_: str, *, request_options: RequestOptionsOrDict | None = None
    ) -> ApiResult[Any, GetUserPasskeyErrorBody]:
        """Whether the user has a passkey, and its credential id

        Args:
            id_: Value sent with the request.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="GET",
            url_template=self._server.default("/v1/users/{id}/passkey"),
            path_params=[param[str]("id", id_)],
            auth_scheme=self._auth.admin,
            decoder=async_json_decoder[Any],
            error_mapper=get_user_passkey_error_mapper,
            request_options=request_options,
        )

    async def reenroll_passkey(
        self,
        id_: str,
        body: V1UsersReenrollRequest | V1UsersReenrollRequestDict,
        *,
        request_options: RequestOptionsOrDict | None = None,
    ) -> ApiResult[Any, ReenrollPasskeyErrorBody]:
        """Mint a re-enrollment token authorized by the current passkey

        Args:
            id_: Value sent with the request.
            body: The request body.
            request_options: Per-call overrides for this one request, such as a timeout, extra headers, or its retry
                count and statuses.

        Returns:
            An ``ApiResult`` holding the deserialized response or the error body."""
        return await self._client.execute(
            http_method="POST",
            url_template=self._server.default("/v1/users/{id}/reenroll"),
            path_params=[param[str]("id", id_)],
            headers=[param[UUID]("Idempotency-Key", uuid4())],
            body=json_body[V1UsersReenrollRequest | V1UsersReenrollRequestDict](body),
            auth_scheme=self._auth.admin,
            decoder=async_json_decoder[Any],
            error_mapper=reenroll_passkey_error_mapper,
            request_options=request_options,
        )
