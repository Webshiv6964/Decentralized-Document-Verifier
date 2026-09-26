import React, { useState } from "react";
import VerificationResult from "../components/VerificationResult";
import { verifyDocument, getDocument, revokeDocument } from "../services/api";

export default function Verify() {
  const [documentId, setDocumentId] = useState("");
  const [cid,        setCid]        = useState("");
  const [loading,    setLoading]    = useState(false);
  const [result,     setResult]     = useState(null);
  const [error,      setError]      = useState("");

  // Lookup panel state
  const [lookupId,      setLookupId]      = useState("");
  const [lookupResult,  setLookupResult]  = useState(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError,   setLookupError]   = useState("");

  // Revoke state
  const [revokeId,      setRevokeId]      = useState("");
  const [revokeLoading, setRevokeLoading] = useState(false);
  const [revokeMsg,     setRevokeMsg]     = useState("");
  const [revokeError,   setRevokeError]   = useState("");

  // ── Verify ──────────────────────────────────────────────────────────────

  async function handleVerify(e) {
    e.preventDefault();
    if (!documentId.trim() || !cid.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await verifyDocument(documentId.trim(), cid.trim());
      setResult(data);
    } catch (err) {
      setError(err.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setResult(null);
    setError("");
    setDocumentId("");
    setCid("");
  }

  // ── Lookup ───────────────────────────────────────────────────────────────

  async function handleLookup(e) {
    e.preventDefault();
    if (!lookupId.trim()) return;

    setLookupLoading(true);
    setLookupError("");
    setLookupResult(null);

    try {
      const data = await getDocument(lookupId.trim());
      setLookupResult(data);
    } catch (err) {
      setLookupError(err.message || "Document not found.");
    } finally {
      setLookupLoading(false);
    }
  }

  // ── Revoke ───────────────────────────────────────────────────────────────

  async function handleRevoke(e) {
    e.preventDefault();
    if (!revokeId.trim()) return;

    if (!window.confirm(`Revoke document "${revokeId}"? This cannot be undone.`)) return;

    setRevokeLoading(true);
    setRevokeError("");
    setRevokeMsg("");

    try {
      const data = await revokeDocument(revokeId.trim());
      setRevokeMsg(data.message || "Document revoked successfully.");
    } catch (err) {
      setRevokeError(err.message || "Revocation failed.");
    } finally {
      setRevokeLoading(false);
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="page page-verify">
      <div className="page-header">
        <h1 className="page-title">Verify Document</h1>
        <p className="page-description">
          Enter the Document ID and IPFS CID to check whether the document is
          authentic and has not been revoked.
        </p>
      </div>

      {/* ── Verify form ────────────────────────────────────────────────── */}
      {error && (
        <div className="alert alert--error" role="alert">
          <span aria-hidden="true">⚠️</span> {error}
          <button
            className="alert-close"
            onClick={() => setError("")}
            aria-label="Dismiss error"
          >
            ✕
          </button>
        </div>
      )}

      {result ? (
        <VerificationResult type="verify" data={result} onReset={handleReset} />
      ) : (
        <form className="card" onSubmit={handleVerify} noValidate>
          <div className="form-group">
            <label htmlFor="verify-doc-id" className="form-label">
              Document ID
            </label>
            <input
              id="verify-doc-id"
              type="text"
              className="form-input"
              placeholder="e.g. DOC001"
              value={documentId}
              onChange={(e) => setDocumentId(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="verify-cid" className="form-label">
              IPFS CID
            </label>
            <input
              id="verify-cid"
              type="text"
              className="form-input"
              placeholder="e.g. bafybeig..."
              value={cid}
              onChange={(e) => setCid(e.target.value)}
              disabled={loading}
              required
            />
            <p className="form-hint">
              The CID was shown when you registered the document.
            </p>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !documentId.trim() || !cid.trim()}
          >
            {loading ? (
              <>
                <span className="spinner" aria-hidden="true" /> Verifying…
              </>
            ) : (
              "Verify Document"
            )}
          </button>
        </form>
      )}

      {/* ── Lookup panel ──────────────────────────────────────────────── */}
      <section className="secondary-panel">
        <h2 className="panel-title">Look Up Document Details</h2>
        <p className="panel-description">
          Retrieve full on-chain information for a registered document.
        </p>

        <form className="card panel-form" onSubmit={handleLookup} noValidate>
          <div className="form-group form-inline">
            <label htmlFor="lookup-id" className="form-label sr-only">
              Document ID
            </label>
            <input
              id="lookup-id"
              type="text"
              className="form-input"
              placeholder="Document ID"
              value={lookupId}
              onChange={(e) => setLookupId(e.target.value)}
              disabled={lookupLoading}
            />
            <button
              type="submit"
              className="btn btn-secondary"
              disabled={lookupLoading || !lookupId.trim()}
            >
              {lookupLoading ? "Looking up…" : "Look Up"}
            </button>
          </div>
        </form>

        {lookupError && (
          <p className="form-error" role="alert">{lookupError}</p>
        )}

        {lookupResult && (
          <div className="card lookup-result">
            <dl className="result-details">
              <div className="result-row">
                <dt>Document ID</dt>
                <dd>{lookupResult.document?.documentId}</dd>
              </div>
              <div className="result-row">
                <dt>CID</dt>
                <dd className="result-cid">
                  <span className="cid-text">{lookupResult.document?.cid}</span>
                  <button
                    className="btn-copy"
                    title="Copy CID"
                    onClick={() =>
                      navigator.clipboard?.writeText(lookupResult.document?.cid)
                    }
                    aria-label="Copy CID"
                  >
                    📋
                  </button>
                </dd>
              </div>
              <div className="result-row">
                <dt>Issuer</dt>
                <dd className="result-cid">
                  <span className="cid-text">{lookupResult.document?.issuer}</span>
                </dd>
              </div>
              <div className="result-row">
                <dt>Timestamp</dt>
                <dd>
                  {new Date(
                    (lookupResult.document?.timestamp || 0) * 1000
                  ).toLocaleString()}
                </dd>
              </div>
              <div className="result-row">
                <dt>Status</dt>
                <dd>
                  <span
                    className={`badge ${
                      lookupResult.document?.valid
                        ? "badge--valid"
                        : "badge--invalid"
                    }`}
                  >
                    {lookupResult.document?.valid ? "VALID" : "REVOKED"}
                  </span>
                </dd>
              </div>
              <div className="result-row">
                <dt>IPFS Link</dt>
                <dd>
                  <a
                    href={lookupResult.ipfs_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="result-link"
                  >
                    Open on IPFS ↗
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        )}
      </section>

      {/* ── Revoke panel ──────────────────────────────────────────────── */}
      <section className="secondary-panel secondary-panel--danger">
        <h2 className="panel-title">Revoke Document</h2>
        <p className="panel-description">
          Permanently invalidate a document. Only the original issuer or
          contract owner can revoke. This action cannot be undone.
        </p>

        <form className="card panel-form" onSubmit={handleRevoke} noValidate>
          <div className="form-group form-inline">
            <label htmlFor="revoke-id" className="form-label sr-only">
              Document ID
            </label>
            <input
              id="revoke-id"
              type="text"
              className="form-input"
              placeholder="Document ID to revoke"
              value={revokeId}
              onChange={(e) => setRevokeId(e.target.value)}
              disabled={revokeLoading}
            />
            <button
              type="submit"
              className="btn btn-danger"
              disabled={revokeLoading || !revokeId.trim()}
            >
              {revokeLoading ? "Revoking…" : "Revoke"}
            </button>
          </div>
        </form>

        {revokeError && (
          <p className="form-error" role="alert">{revokeError}</p>
        )}
        {revokeMsg && (
          <p className="form-success" role="status">{revokeMsg}</p>
        )}
      </section>
    </div>
  );
}
