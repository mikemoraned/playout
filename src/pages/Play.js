import React from "react";
import { Grid } from "../components/Grid";
import { TeamsMini } from "../components/TeamsMini";
import { TeamsFull } from "../components/TeamsFull";
import { Evaluation } from "../components/Evaluation";
import { StoreProvider } from "../model/contexts.js";
import { Biases } from "../components/Biases";
import { useParams, Redirect } from "react-router-dom";
import { parseProblemFrom } from "../model/problem";
import "./Play.scss";

function gameInstance(problem) {
  const store = problem.toStore();
  store.mode.setPlayMode();
  return (
    <StoreProvider initialStore={store}>
      <div className="container">
        <div className="mt-3 sticky-evaluation">
          <Evaluation />
        </div>
        <div className="columns">
          <div className="column is-two-thirds">
            <section className="section">
              <h1 className="title is-4">Layout</h1>
              <p className="subtitle is-6">
                <span className="icon">
                  <i className="fas fa-border-all"></i>
                </span>{" "}
                Place Team Members in Seats
              </p>
              <TeamsMini />
              <Grid />
            </section>
          </div>
          <div className="column">
            <section className="section">
              <h1 className="title is-4">Teams</h1>
              <p className="subtitle is-6">
                <span className="icon">
                  <i className="fas fa-user"></i>
                </span>
              </p>
              <TeamsFull />
            </section>
            <section className="section">
              <h1 className="title is-4">Biases</h1>
              <p className="subtitle is-6">
                <span className="icon">
                  <i className="fas fa-star"></i>
                </span>{" "}
                Who wants what?
              </p>
              <Biases />
            </section>
          </div>
        </div>
      </div>
    </StoreProvider>
  );
}

export default function Play() {
  const { gridSpec, teamsSpec } = useParams();

  try {
    return gameInstance(parseProblemFrom(gridSpec, teamsSpec));
  } catch (e) {
    console.log(e);
    return <Redirect to="/" />;
  }
}
