import React from "react";

export function Navigation({ version }) {
  return (
    <nav
      className="navbar is-light"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-brand">
        <a className="navbar-item" href="https://playout.houseofmoran.io/">
          <span
            style={{
              marginLeft: "0.5em",
              font: "small-caps bold 25px monospace",
            }}
          >
            P L{" "}
            <span className="icon">
              <i className="far fa-user fa-xs"></i>
            </span>{" "}
            Y{" "}
            <span className="icon is-small">
              <i className={`far fa-smile fa-xs`}></i>
            </span>{" "}
            U T
          </span>
        </a>
        <div className="navbar-item">
          <span className="tag is-info is-medium">v{version}</span>
        </div>

        <a
          className="navbar-item"
          href="https://github.com/mikemoraned/playout"
        >
          <span className="icon is-medium">
            <i className="fab fa-github-square fa-2x"></i>
          </span>
        </a>
      </div>
    </nav>
  );
}
