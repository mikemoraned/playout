import React from "react";
import { useState } from "react";
import { About } from "./pages/About";

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
  const [activeDesktop, setActiveDesktop] = useState(false);
  return (
    <nav
      className="navbar is-light"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-brand">
        <a className="navbar-item" href="https://playout.houseofmoran.io/">
          <Logo fontSize="25px" />
        </a>
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
          <div
            className={`navbar-item has-dropdown ${
              activeDesktop ? "is-active" : ""
            }`}
            onClick={() => setActiveDesktop(!activeDesktop)}
          >
            {/* eslint-disable-next-line */}
            <a className="navbar-link is-arrowless">
              <span className="icon is-medium">
                <i className="fas fa-info-circle fa-2x"></i>
              </span>
            </a>

            <div className="navbar-dropdown is-left">
              <div className="navbar-item">
                <About />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
