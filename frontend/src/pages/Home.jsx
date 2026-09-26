import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="page page-home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-icon" aria-hidden="true">🔗</div>
        <h1 className="hero-title">Decentralized Document Verifier</h1>
        <p className="hero-subtitle">
          Secure, tamper-proof document verification powered by IPFS and
          Ethereum blockchain. Upload once — verify forever.
        </p>

        <div className="hero-actions">
          <button
            className="btn btn-primary btn-lg"
            onClick={() => navigate("/register")}
          >
            Register Document
          </button>
          <button
            className="btn btn-outline btn-lg"
            onClick={() => navigate("/verify")}
          >
            Verify Document
          </button>
        </div>
      </section>

      {/* How it works */}
      <section className="how-it-works">
        <h2 className="section-title">How It Works</h2>

        <div className="steps">
          <div className="step">
            <div className="step-number" aria-hidden="true">1</div>
            <div className="step-content">
              <h3>Upload Document</h3>
              <p>
                Choose any file and give it a unique ID. The file is sent to the
                backend and uploaded to IPFS via Pinata.
              </p>
            </div>
          </div>

          <div className="step-arrow" aria-hidden="true">→</div>

          <div className="step">
            <div className="step-number" aria-hidden="true">2</div>
            <div className="step-content">
              <h3>CID Generated</h3>
              <p>
                IPFS produces a unique Content Identifier (CID) — a
                cryptographic fingerprint of your file.
              </p>
            </div>
          </div>

          <div className="step-arrow" aria-hidden="true">→</div>

          <div className="step">
            <div className="step-number" aria-hidden="true">3</div>
            <div className="step-content">
              <h3>Stored on Blockchain</h3>
              <p>
                The CID is written to an Ethereum smart contract. It cannot be
                altered or deleted.
              </p>
            </div>
          </div>

          <div className="step-arrow" aria-hidden="true">→</div>

          <div className="step">
            <div className="step-number" aria-hidden="true">4</div>
            <div className="step-content">
              <h3>Verify Anytime</h3>
              <p>
                Provide the Document ID and CID. The contract compares them and
                returns <strong>VALID</strong> or <strong>INVALID</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="features">
        <div className="feature-card">
          <span className="feature-icon" aria-hidden="true">🛡️</span>
          <h3>Tamper-Proof</h3>
          <p>Blockchain records are immutable — once stored, the CID cannot be changed.</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon" aria-hidden="true">🌐</span>
          <h3>Decentralized Storage</h3>
          <p>Files live on IPFS — no single server can take them down.</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon" aria-hidden="true">⚡</span>
          <h3>Instant Verification</h3>
          <p>Verify any document in seconds with just its ID and CID.</p>
        </div>
      </section>
    </div>
  );
}
