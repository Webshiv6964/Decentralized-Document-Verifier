"""
main.py
Entry point for the FastAPI backend server.

Start with:
    uvicorn app.main:app --reload
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import router
from app.db import init_db, close_db


# ── Lifespan (startup / shutdown) ─────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup — create the asyncpg pool and ensure the table exists
    await init_db()
    yield
    # Shutdown — close pool cleanly
    await close_db()


# ── App setup ────────────────────────────────────────────────────────────────

app = FastAPI(
    title="Decentralized Document Verifier API",
    description="REST API for uploading documents to IPFS and verifying them on-chain.",
    version="1.0.0",
    lifespan=lifespan,
)

# ── CORS ─────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routes ───────────────────────────────────────────────────────────────────

app.include_router(router, prefix="/api")


# ── Health check ─────────────────────────────────────────────────────────────

@app.get("/", tags=["Health"])
def health_check():
    return {"status": "ok", "message": "Document Verifier API is running"}
