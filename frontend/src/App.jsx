import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Verify from "./pages/Verify";

export default function App() {
  return (
    <div className="app">
      <Navbar />

      <main className="main-content">
        <Routes>
          <Route path="/"         element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify"   element={<Verify />} />
        </Routes>
      </main>

      <footer className="footer">
        <p>
          Decentralized Document Verifier &mdash; Powered by IPFS &amp; Ethereum
        </p>
      </footer>
    </div>
  );
}
