import React from "react";
import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Logo } from "./Logo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faUserCog } from "@fortawesome/pro-duotone-svg-icons";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";

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
          <Logo fontSize="25px" style={{ marginLeft: "0.5em" }} />
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
        <div className="navbar-end">
          <NavLink to="/about" className="navbar-item">
            <span className="icon is-medium">
              <FontAwesomeIcon icon={faInfoCircle} size="2x" />
            </span>
          </NavLink>
          <a href="https://twitter.com/playoutgame" className="navbar-item">
            <span className="icon">
              <FontAwesomeIcon icon={faTwitter} size="2x" />
            </span>
          </a>
          <NavLink to="/settings" className="navbar-item">
            <span className="icon is-medium">
              <FontAwesomeIcon icon={faUserCog} size="2x" />
            </span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
