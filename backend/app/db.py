"""
db.py
asyncpg connection pool — created once at startup, shared across all requests.

Usage:
    from app.db import get_pool

    pool = await get_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow("SELECT ...")
"""

import os
import asyncpg
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/docverifier")

# Module-level pool — None until init_db() is called
_pool: asyncpg.Pool | None = None


def _build_connect_kwargs() -> dict:
    """
    Build extra kwargs for asyncpg.create_pool.
    Supabase (and any remote Postgres) requires SSL.
    We detect this by checking if the host is NOT localhost/127.0.0.1.
    """
    import ssl
    from urllib.parse import urlparse

    parsed = urlparse(DATABASE_URL)
    host = parsed.hostname or ""
    is_local = host in ("localhost", "127.0.0.1", "::1")

    if not is_local:
        # Supabase uses a self-signed cert in its chain — disable verification
        ssl_ctx = ssl.create_default_context()
        ssl_ctx.check_hostname = False
        ssl_ctx.verify_mode = ssl.CERT_NONE
        return {"ssl": ssl_ctx}

    return {}


async def init_db() -> None:
    """
    Create the connection pool and ensure the documents table exists.
    Called once from app lifespan on startup.
    """
    global _pool
    extra = _build_connect_kwargs()
    _pool = await asyncpg.create_pool(DATABASE_URL, min_size=2, max_size=10, **extra)

    async with _pool.acquire() as conn:
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS documents (
                document_id   TEXT PRIMARY KEY,
                cid           TEXT NOT NULL,
                issuer        TEXT NOT NULL,
                timestamp     BIGINT NOT NULL,
                valid         BOOLEAN NOT NULL DEFAULT TRUE,
                tx_hash       TEXT,
                ipfs_url      TEXT,
                filename      TEXT,
                created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
        """)


async def close_db() -> None:
    """Close the pool gracefully on shutdown."""
    global _pool
    if _pool:
        await _pool.close()
        _pool = None


async def get_pool() -> asyncpg.Pool:
    """Return the active pool. Raises if init_db() was never called."""
    if _pool is None:
        raise RuntimeError("Database pool is not initialised. Call init_db() first.")
    return _pool
