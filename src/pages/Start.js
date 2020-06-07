import React from "react";
import { useHistory } from "react-router-dom";
import { randomEasyProblem, randomHardProblem } from "../model/problem";

export function Start() {
  const history = useHistory();

  function visitRandomGameLink(problem) {
    const path = `/play/${problem.grid.toVersion2Format()}/${problem.teams.toVersion1Format()}`;
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
                onClick={() => visitRandomGameLink(randomEasyProblem())}
              >
                <span className="icon">
                  <i className="fas fa-chess-board"></i>
                </span>
                <span>Random Easy Game</span>
              </button>

              <button
                className="button is-link is-light"
                onClick={() => visitRandomGameLink(randomHardProblem())}
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
