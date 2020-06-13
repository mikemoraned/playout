import React from "react";
import { Grid } from "../components/Grid";
import { TeamsFull } from "../components/TeamsFull";
import { StoreProvider } from "../model/store.js";
import { Biases } from "../components/Biases";
import { randomEasyProblem } from "../model/problem";
import { useContext } from "react";
import { StoreContext } from "../model/store.js";

import { observer } from "mobx-react";

const Instance = observer(() => {
  const { store } = useContext(StoreContext);

  return (
    <div className="container">
      <section className="section">
        <div className="columns">
          <div className="column">
            <div className="tabs is-medium is-boxed is-toggle">
              <ul>
                <li className={store.mode.name === "Build" ? "is-active" : ""}>
                  <a href="#build" onClick={() => store.mode.setBuildMode()}>
                    Edit
                  </a>
                </li>
                <li className={store.mode.name === "Play" ? "is-active" : ""}>
                  <a href="#play" onClick={() => store.mode.setPlayMode()}>
                    Play Test
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
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
  );
});

export function Build() {
  const problem = randomEasyProblem();
  const store = problem.toStore();
  store.mode.setBuildMode();

  return (
    <StoreProvider initialStore={store}>
      <Instance />
    </StoreProvider>
  );
}
