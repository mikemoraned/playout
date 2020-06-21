import React from "react";
import { Grid } from "../components/Grid";
import { TeamsFull } from "../components/TeamsFull";
import { StoreProvider } from "../model/contexts.js";
import { Biases } from "../components/Biases";
import { useContext } from "react";
import { StoreContext } from "../model/contexts.js";
import { useParams, Redirect } from "react-router-dom";
import { Problem, defaultTeamsSpec } from "../model/problem";

import { observer } from "mobx-react";
import { parseAreaSpec } from "../model/grid/area_spec.format";

const Instance = observer(() => {
  const { store } = useContext(StoreContext);
  const problem = store.toProblem();
  const base = window.location.href;
  const path = `/play/${problem.grid.toVersion2Format()}/${problem.teams.toVersion1Format()}`;
  const fullURL = new URL(path, base);
  return (
    <div className="container">
      <div className="columns mt-3 ml-3">
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
        <div className="column">
          <button
            className="button is-success"
            disabled={!store.solvable}
            onClick={() => {
              window.open(fullURL, "_blank");
            }}
          >
            <span className="icon">
              <i className="fas fa-external-link-alt"></i>
            </span>
            <span>Open in new tab</span>
          </button>
        </div>
      </div>
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
  const { areaSpec } = useParams();
  try {
    const gridSpec = parseAreaSpec(areaSpec).toGridSpec();
    const problemSpec = Problem.create({
      grid: gridSpec,
      teams: defaultTeamsSpec(),
    });

    const store = problemSpec.toStore();
    store.mode.setBuildMode();

    return (
      <StoreProvider initialStore={store}>
        <Instance />
      </StoreProvider>
    );
  } catch (e) {
    console.log(e);
    return <Redirect to="/" />;
  }
}
