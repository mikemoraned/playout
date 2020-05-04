import React from "react";
import "./App.scss";
import { Navigation } from "./Navigation";
import { Grid } from "./Grid";
import { TeamsMini } from "./TeamsMini";
import { TeamsFull } from "./TeamsFull";
import { Progress } from "./Progress";
import { StoreProvider } from "./store.js";
import { version } from "../package.json";

function App() {
  return (
    <div className="App">
      <Navigation version={version} />
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
                <Progress />
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
            </div>
          </div>
        </div>
      </StoreProvider>
    </div>
  );
}

export default App;
