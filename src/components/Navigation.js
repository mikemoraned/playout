import React from "react";
import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Logo } from "./Logo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

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
          <NavLink
            to="/about"
            className="navbar-item"
            activeClassName="is-active"
          >
            <span className="icon is-medium">
              <FontAwesomeIcon icon={faInfoCircle} size="2x" />
            </span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
