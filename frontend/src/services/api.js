/**
 * api.js
 * All HTTP calls to the Python FastAPI backend.
 *
 * The Vite dev proxy forwards /api → http://localhost:8000
 * so no hardcoded base URL is needed during development.
 */

import axios from "axios";

const client = axios.create({
  baseURL: "/api",
  timeout: 60_000, // 60 s — IPFS uploads can be slow
});

// ── Response interceptor ──────────────────────────────────────────────────────
// Normalise error messages so every caller just sees err.message
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server replied with a non-2xx status
      const detail = error.response.data?.detail;
      const message =
        typeof detail === "string"
          ? detail
          : Array.isArray(detail)
          ? detail.map((d) => d.msg).join(", ")
          : `Request failed with status ${error.response.status}`;
      return Promise.reject(new Error(message));
    }

    if (error.request) {
      // Request was sent but no response received
      return Promise.reject(
        new Error(
          "Cannot reach the backend server. Make sure it is running on port 8000."
        )
      );
    }

    return Promise.reject(error);
  }
);

// ── API functions ─────────────────────────────────────────────────────────────

/**
 * Register a document.
 * Uploads the file to IPFS and stores the CID on-chain.
 *
 * @param {string} documentId
 * @param {File}   file
 * @returns {Promise<object>} { success, document_id, cid, ipfs_url, tx_hash, issuer, message }
 */
export async function registerDocument(documentId, file) {
  const formData = new FormData();
  formData.append("document_id", documentId);
  formData.append("file", file);

  const { data } = await client.post("/documents/register", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

/**
 * Verify a document against the blockchain record.
 *
 * @param {string} documentId
 * @param {string} cid
 * @returns {Promise<object>} { verified, status, message }
 */
export async function verifyDocument(documentId, cid) {
  const { data } = await client.post("/documents/verify", {
    document_id: documentId,
    cid,
  });
  return data;
}

/**
 * Fetch full on-chain document details.
 *
 * @param {string} documentId
 * @returns {Promise<object>} { success, document: { documentId, cid, issuer, timestamp, valid }, ipfs_url }
 */
export async function getDocument(documentId) {
  const { data } = await client.get(`/documents/${encodeURIComponent(documentId)}`);
  return data;
}

/**
 * Revoke a registered document.
 *
 * @param {string} documentId
 * @returns {Promise<object>} { success, document_id, tx_hash, message }
 */
export async function revokeDocument(documentId) {
  const { data } = await client.post("/documents/revoke", {
    document_id: documentId,
  });
  return data;
}
