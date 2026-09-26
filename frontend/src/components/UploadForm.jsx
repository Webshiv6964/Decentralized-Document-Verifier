import React, { useState } from "react";

/**
 * UploadForm
 *
 * Props:
 *   onSubmit(documentId, file) — called when the user submits the form
 *   loading                    — disables the form while a request is in progress
 */
export default function UploadForm({ onSubmit, loading }) {
  const [documentId, setDocumentId] = useState("");
  const [file, setFile]             = useState(null);
  const [fileError, setFileError]   = useState("");

  function handleFileChange(e) {
    const selected = e.target.files[0];
    setFileError("");

    if (selected && selected.size > 10 * 1024 * 1024) {
      setFileError("File size must be under 10 MB.");
      setFile(null);
      return;
    }

    setFile(selected || null);
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!documentId.trim()) return;
    if (!file) {
      setFileError("Please select a file to upload.");
      return;
    }

    onSubmit(documentId.trim(), file);
  }

  return (
    <form className="card" onSubmit={handleSubmit} noValidate>
      {/* Document ID */}
      <div className="form-group">
        <label htmlFor="doc-id" className="form-label">
          Document ID
        </label>
        <input
          id="doc-id"
          type="text"
          className="form-input"
          placeholder="e.g. DOC001"
          value={documentId}
          onChange={(e) => setDocumentId(e.target.value)}
          disabled={loading}
          required
          aria-describedby="doc-id-hint"
        />
        <p id="doc-id-hint" className="form-hint">
          A unique identifier for this document. You will need it to verify later.
        </p>
      </div>

      {/* File picker */}
      <div className="form-group">
        <label htmlFor="doc-file" className="form-label">
          Select Document
        </label>
        <input
          id="doc-file"
          type="file"
          className="form-input file-input"
          onChange={handleFileChange}
          disabled={loading}
          aria-describedby={fileError ? "file-error" : undefined}
        />
        {file && (
          <p className="form-hint">
            Selected: <strong>{file.name}</strong> ({(file.size / 1024).toFixed(1)} KB)
          </p>
        )}
        {fileError && (
          <p id="file-error" className="form-error" role="alert">
            {fileError}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        disabled={loading || !documentId.trim() || !file}
      >
        {loading ? (
          <>
            <span className="spinner" aria-hidden="true" /> Registering…
          </>
        ) : (
          "Register Document"
        )}
      </button>
    </form>
  );
}
