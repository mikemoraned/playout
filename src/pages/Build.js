import React from "react";
import { Grid } from "../components/Grid";
import { TeamsFull } from "../components/TeamsFull";
import { StoreProvider } from "../model/store.js";
import { Biases } from "../components/Biases";
import { randomEasyProblem } from "../model/problem";

function gameInstance(problem) {
  const store = problem.toStore();
  store.mode.setBuildMode();
  return (
    <StoreProvider initialStore={store}>
      <div className="container">
        <div className="columns">
          <div className="column is-two-thirds">
            <section className="section">
              <h1 className="title is-4">Layout</h1>
              <p className="subtitle is-6">
                <span className="icon">
                  <i className="fas fa-border-all"></i>
                </span>{" "}
                Edit layout
              </p>
              <Grid />
            </section>
          </div>
          <div className="column">
            <section className="section">
              <h1 className="title is-4">Teams</h1>
              <p className="subtitle is-6">
                <span className="icon">
                  <i className="fas fa-user-edit"></i>
                </span>{" "}
                Edit Teams
              </p>
              <TeamsFull />
            </section>
            <section className="section">
              <h1 className="title is-4">Biases</h1>
              <p className="subtitle is-6">
                <span className="icon">
                  <i className="fas fa-star"></i>
                </span>{" "}
                Edit Biases
              </p>
              <Biases />
            </section>
          </div>
        </div>
      </div>
    </StoreProvider>
  );
}

export function Build() {
  const problem = randomEasyProblem();

  return gameInstance(problem);
}
