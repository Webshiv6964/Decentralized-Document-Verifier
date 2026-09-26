import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-icon">🔗</span>
        <Link to="/" className="navbar-title">
          DocVerifier
        </Link>
      </div>

      <ul className="navbar-links">
        <li>
          <Link
            to="/"
            className={`nav-link ${pathname === "/" ? "nav-link--active" : ""}`}
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/register"
            className={`nav-link ${pathname === "/register" ? "nav-link--active" : ""}`}
          >
            Register
          </Link>
        </li>
        <li>
          <Link
            to="/verify"
            className={`nav-link ${pathname === "/verify" ? "nav-link--active" : ""}`}
          >
            Verify
          </Link>
        </li>
      </ul>
    </nav>
  );
}
