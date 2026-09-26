import React, { useState } from "react";
import UploadForm from "../components/UploadForm";
import VerificationResult from "../components/VerificationResult";
import { registerDocument } from "../services/api";

export default function Register() {
  const [loading, setLoading]   = useState(false);
  const [result,  setResult]    = useState(null);   // success response
  const [error,   setError]     = useState("");      // error message

  async function handleSubmit(documentId, file) {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await registerDocument(documentId, file);
      setResult(data);
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setResult(null);
    setError("");
  }

  return (
    <div className="page page-register">
      <div className="page-header">
        <h1 className="page-title">Register Document</h1>
        <p className="page-description">
          Upload a document to IPFS and store its CID permanently on the
          blockchain. You will receive a unique CID to use for verification later.
        </p>
      </div>

      {/* Error banner */}
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

      {/* Show form or success result */}
      {result ? (
        <VerificationResult type="register" data={result} onReset={handleReset} />
      ) : (
        <UploadForm onSubmit={handleSubmit} loading={loading} />
      )}

      {/* Info box */}
      {!result && (
        <div className="info-box">
          <h3>📋 What happens when you register?</h3>
          <ol>
            <li>Your file is uploaded to IPFS via Pinata.</li>
            <li>IPFS generates a CID — a unique fingerprint of your file.</li>
            <li>
              The Document ID and CID are stored on the Ethereum blockchain via
              a smart contract.
            </li>
            <li>Save your CID — you will need it to verify this document.</li>
          </ol>
        </div>
      )}
    </div>
  );
}
