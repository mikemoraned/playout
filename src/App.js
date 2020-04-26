import React from "react";
import "./App.scss";

function Navigation() {
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
              "margin-left": "0.5em",
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

function App() {
  return (
    <div className="App">
      <Navigation />
      <section className="section">
        <div className="container">
          <h1 className="title">Hello World</h1>
          <p className="subtitle">
            My first website with <strong>Bulma</strong>!
          </p>
        </div>
      </section>
    </div>
  );
}

export default App;
