import React from "react";
import { useHistory } from "react-router-dom";
import { randomEasyGridSpec, randomHardGridSpec } from "../model/problem";

export function Start() {
  const history = useHistory();

  function visitRandomGameLink(gridSpec) {
    const path = `/play/${gridSpec.toVersion1Format()}`;
    history.push(path);
  }
  return (
    <>
      <section className="hero is-medium is-primary is-bold">
        <div className="hero-body">
          <div className="container">
            <h1 className="title">Start</h1>
            <div className="buttons">
              <button
                className="button is-link is-light"
                onClick={() => visitRandomGameLink(randomEasyGridSpec())}
              >
                <span className="icon">
                  <i className="fas fa-chess-board"></i>
                </span>
                <span>Random Easy Game</span>
              </button>

              <button
                className="button is-link is-light"
                onClick={() => visitRandomGameLink(randomHardGridSpec())}
              >
                <span className="icon">
                  <i className="fas fa-chess-board"></i>
                </span>
                <span>Random Hard Game</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
