import React from "react";

/**
 * VerificationResult
 *
 * Renders the result of a register or verify operation.
 *
 * Props:
 *   type    — "register" | "verify"
 *   data    — the response object from the API
 *   onReset — called when the user clicks "Start Over"
 */
export default function VerificationResult({ type, data, onReset }) {
  if (!data) return null;

  // ── Register result ────────────────────────────────────────────────────────
  if (type === "register") {
    return (
      <div className="card result-card result-card--success" role="status">
        <div className="result-icon" aria-hidden="true">✓</div>
        <h2 className="result-title">Document Registered</h2>

        <dl className="result-details">
          <div className="result-row">
            <dt>Document ID</dt>
            <dd>{data.document_id}</dd>
          </div>

          <div className="result-row">
            <dt>IPFS CID</dt>
            <dd className="result-cid">
              <span className="cid-text">{data.cid}</span>
              <button
                className="btn-copy"
                title="Copy CID"
                onClick={() => navigator.clipboard?.writeText(data.cid)}
                aria-label="Copy CID to clipboard"
              >
                📋
              </button>
            </dd>
          </div>

          <div className="result-row">
            <dt>Status</dt>
            <dd>
              <span className="badge badge--valid">VALID</span>
            </dd>
          </div>

          <div className="result-row">
            <dt>View on IPFS</dt>
            <dd>
              <a
                href={data.ipfs_url}
                target="_blank"
                rel="noopener noreferrer"
                className="result-link"
              >
                Open on IPFS Gateway ↗
              </a>
            </dd>
          </div>

          {data.tx_hash && (
            <div className="result-row">
              <dt>Transaction</dt>
              <dd className="result-cid">
                <span className="cid-text">{data.tx_hash}</span>
              </dd>
            </div>
          )}
        </dl>

        <button className="btn btn-secondary" onClick={onReset}>
          Register Another
        </button>
      </div>
    );
  }

  // ── Verify result ──────────────────────────────────────────────────────────
  const isValid = data.verified === true;

  return (
    <div
      className={`card result-card ${isValid ? "result-card--success" : "result-card--failure"}`}
      role="status"
    >
      <div className="result-icon" aria-hidden="true">
        {isValid ? "✓" : "✗"}
      </div>

      <h2 className="result-title">
        {isValid ? "Document Verified" : "Verification Failed"}
      </h2>

      <p className="result-message">{data.message}</p>

      <div className="result-badge-row">
        <span className={`badge ${isValid ? "badge--valid" : "badge--invalid"}`}>
          {data.status}
        </span>
      </div>

      <button className="btn btn-secondary" onClick={onReset}>
        Verify Another
      </button>
    </div>
  );
}
