import React from "react";

export function Navigation() {
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
            P L A Y O U T
          </span>
        </a>
      </div>
    </nav>
  );
}
