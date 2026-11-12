from __future__ import annotations

from dataclasses import dataclass

from .core import AsyncAuthScheme, AuthScheme


@dataclass(frozen=True, slots=True, kw_only=True)
class AuthSchemes:
    admin: AuthScheme
    agent: AuthScheme
    cron: AuthScheme


@dataclass(frozen=True, slots=True, kw_only=True)
class AsyncAuthSchemes:
    admin: AsyncAuthScheme
    agent: AsyncAuthScheme
    cron: AsyncAuthScheme
