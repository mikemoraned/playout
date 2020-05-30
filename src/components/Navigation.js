import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

function Logo({ fontSize }) {
  return (
    <span
      style={{
        marginLeft: "0.5em",
        font: `small-caps bold ${fontSize} monospace`,
      }}
    >
      P L{" "}
      <span className="icon is-small">
        <i className="far fa-user fa-xs"></i>
      </span>{" "}
      Y{" "}
      <span className="icon is-small">
        <i className={`far fa-smile fa-xs`}></i>
      </span>{" "}
      U T
    </span>
  );
}

export function Navigation({ version }) {
  const [activeMobile, setActiveMobile] = useState(false);
  return (
    <nav
      className="navbar is-light"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-brand">
        <Link to="/" className="navbar-item">
          <Logo fontSize="25px" />
        </Link>
        <a
          className="navbar-item"
          href="https://github.com/mikemoraned/playout/releases"
        >
          <span className="tag is-info is-medium">v{version}</span>
        </a>
        {/* eslint-disable-next-line */}
        <a
          role="button"
          className={`navbar-burger ${activeMobile ? "is-active" : ""}`}
          aria-label="menu"
          aria-expanded="false"
          onClick={() => setActiveMobile(!activeMobile)}
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>
      <div
        className={`navbar-menu ${
          activeMobile ? "navbar-menu-mobile-active" : ""
        }`}
      >
        <div className="navbar-start">
          <Link to="/about" className="navbar-item">
            <span className="icon is-medium">
              <i className="fas fa-info-circle fa-2x"></i>
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
