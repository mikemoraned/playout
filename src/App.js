import React from "react";
import "./App.scss";
import { Navigation } from "./Navigation";

function Grid({ width, height }) {
  return (
    <div className="table-container">
      <table width={"100%"} className="table">
        <tbody>
          {[...Array(height).keys()].map((k) => {
            return (
              <tr key={k}>
                {[...Array(width).keys()].map((k) => {
                  if (Math.random() < 0.5) {
                    return (
                      <td
                        key={k}
                        style={{
                          border: "1px solid black",
                          backgroundColor: "black",
                          color: "white",
                          textAlign: "center",
                        }}
                      >
                        A<sub>1</sub>
                      </td>
                    );
                  }
                  return (
                    <td
                      key={k}
                      style={{
                        border: "1px solid black",
                        backgroundColor: "white",
                        color: "black",
                        textAlign: "center",
                      }}
                    >
                      B<sub>1</sub>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function AddRemoveMembersHeader() {
  return (
    <div>
      <span className="icon">
        <i className="fas fa-plus"></i>
      </span>
      /
      <span className="icon">
        <i className="fas fa-minus"></i>
      </span>
    </div>
  );
}

function AddRemoveMembers() {
  return (
    <div className="field is-grouped">
      <div className="buttons are-small has-addons">
        <button className="button">
          <span className="icon">
            <i className="fas fa-plus"></i>
          </span>
        </button>
        <button className="button">
          <span className="icon">
            <i className="fas fa-minus"></i>
          </span>
        </button>
      </div>
    </div>
  );
}

function TeamsMini() {
  return (
    <div className="field is-horizontal">
      <div className="field-label is-normal">
        <label className="label">Next from:</label>
      </div>
      <div className="field-body">
        <div className="field is-grouped">
          <div className="control">
            <div className="buttons are-small has-addons">
              <button className="button">
                <span>A (2)</span>
              </button>
              <button className="button is-primary">
                <span>B (1)</span>
              </button>
              <button className="button">
                <span>C (2)</span>
              </button>
            </div>
          </div>
          <div className="control">
            <button className="button is-small">
              <span className="icon">
                <i className="fas fa-undo"></i>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TeamsFull() {
  return (
    <div>
      <div className="field">
        <div className="control">
          <table className="table is-narrow is-hoverable">
            <thead>
              <tr>
                <th>Team</th>
                <th>Members</th>
                <th>
                  <AddRemoveMembersHeader />
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>A</td>
                <td>
                  <span className="has-text-grey-light">
                    A<sub>1</sub>
                  </span>
                  , A<sub>2</sub>, A<sub>3</sub>
                </td>
                <td>
                  <AddRemoveMembers />
                </td>
              </tr>
              <tr className="is-selected">
                <td>B</td>
                <td>
                  <span className="has-text-grey-light">
                    B<sub>1</sub>
                  </span>
                  , B<sub>2</sub>
                </td>
                <td>
                  <AddRemoveMembers />
                </td>
              </tr>
              <tr>
                <td>C</td>
                <td>
                  <span className="has-text-grey-light">
                    C<sub>1</sub>, C<sub>2</sub>
                  </span>
                  , C<sub>3</sub>, C<sub>4</sub>
                </td>
                <td>
                  <AddRemoveMembers />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="field">
        <div className="control">
          <button className="button is-primary">Add Team</button>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <Navigation />
      <div className="container">
        <div className="columns">
          <div className="column is-two-thirds">
            <section className="section">
              <h1 className="title is-4">Layout</h1>
              <p className="subtitle is-6">Place Team Members in Seats</p>
              <TeamsMini />
              <Grid width={10} height={10} />
            </section>
          </div>
          <div className="column">
            <section className="section">
              <h1 className="title is-4">Teams</h1>
              <p className="subtitle is-6">Add / Remove Teams</p>
              <TeamsFull />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
