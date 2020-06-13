import React from "react";
import { useHistory, Link } from "react-router-dom";
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
            <div className="columns">
              <div className="column">
                <h1 className="title">Play</h1>
                <div className="buttons">
                  <button
                    className="button is-link is-light"
                    onClick={() => visitRandomGameLink(randomEasyProblem())}
                  >
                    <span className="icon">
                      <i className="fas fa-play"></i>
                    </span>
                    <span>Random Easy Game</span>
                  </button>

                  <button
                    className="button is-link is-light"
                    onClick={() => visitRandomGameLink(randomHardProblem())}
                  >
                    <span className="icon">
                      <i className="fas fa-play"></i>
                    </span>
                    <span>Random Hard Game</span>
                  </button>
                </div>
              </div>
              <div className="column">
                <h1 className="title">Build</h1>
                <div className="buttons">
                  <button className="button is-link is-light">
                    <Link to="/build/5x5">
                      <span className="icon">
                        <i className="fas fa-chess-board"></i>
                      </span>
                      <span>5 x 5</span>
                    </Link>
                  </button>
                  <button className="button is-link is-light">
                    <Link to="/build/10x10">
                      <span className="icon">
                        <i className="fas fa-chess-board"></i>
                      </span>
                      <span>10 x 10</span>
                    </Link>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
