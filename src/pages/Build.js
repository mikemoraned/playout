import React from "react";
import { Grid } from "../Grid";
import { TeamsMini } from "../TeamsMini";
import { TeamsFull } from "../TeamsFull";
import { Evaluation } from "../Evaluation";
import { StoreProvider } from "../model/store.js";
import { Biases } from "../Biases";

export function Build() {
  return (
    <StoreProvider>
      <div className="container">
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
              <Evaluation />
              <TeamsMini />
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
