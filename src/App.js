import React from "react";
import { useContext } from "react";
import "./App.scss";
import { Navigation } from "./Navigation";
import {
  positionFor,
  StoreContext,
  StoreProvider,
  togglePlaceMemberAction,
  selectTeamAction,
} from "./store.js";

function Grid() {
  const { state, dispatch } = useContext(StoreContext);
  const { width, height, seats, occupied } = state.grid;
  return (
    <div className="table-container">
      <table width={"100%"} className="table" style={{ tableLayout: "fixed" }}>
        <tbody>
          {[...Array(height).keys()].map((y) => {
            return (
              <tr key={y}>
                {[...Array(width).keys()].map((x) => {
                  const key = `${x}_${y}`;
                  const position = positionFor(x, y);
                  const has_seat = seats.indexOf(position) !== -1;
                  const occupancy = occupied.find(
                    (o) => o.position === position
                  );
                  return (
                    <td
                      className={`${has_seat ? "has-background-info" : ""}`}
                      onClick={() =>
                        dispatch(togglePlaceMemberAction(position))
                      }
                      key={key}
                      style={{
                        textAlign: "center",
                        border: "1px solid black",
                      }}
                    >
                      <span
                        className="icon is-hidden-mobile"
                        style={{
                          visibility: `${has_seat ? "visible" : "hidden"}`,
                        }}
                      >
                        <i className="fas fa-desktop"></i>
                      </span>
                      {occupancy && (
                        <span>
                          {occupancy.member.team}
                          <sub>{occupancy.member.index + 1}</sub>
                        </span>
                      )}
                      {!occupancy && (
                        <span style={{ visibility: "hidden" }}>
                          A<sub>1</sub>
                        </span>
                      )}
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
        <i className="fas fa-user-plus"></i>
      </span>
      /
      <span className="icon">
        <i className="fas fa-user-minus"></i>
      </span>
    </div>
  );
}

function AddRemoveMembers() {
  return (
    <div className="field is-grouped">
      <div className="buttons are-small has-addons">
        <button className="button" disabled>
          <span className="icon">
            <i className="fas fa-user-plus"></i>
          </span>
        </button>
        <button className="button" disabled>
          <span className="icon">
            <i className="fas fa-user-minus"></i>
          </span>
        </button>
      </div>
    </div>
  );
}

function TeamsMini() {
  const { state, dispatch } = useContext(StoreContext);
  const { teams, undos } = state;
  return (
    <div className="field is-horizontal">
      <div className="field-label is-normal">
        <label className="label">
          Next{" "}
          <span className="icon">
            <i className="fas fa-user"></i>
          </span>{" "}
          from:
        </label>
      </div>
      <div className="field-body">
        <div className="field is-grouped">
          <div className="control">
            <div className="buttons are-small has-addons">
              {teams.list.map((t) => {
                const isNext = teams.next === t.name;
                return (
                  <button
                    key={t.name}
                    className={`button ${isNext ? "is-primary" : ""}`}
                    onClick={() => dispatch(selectTeamAction(t.name))}
                  >
                    <span>
                      {t.name} ({t.remaining})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="control">
            <button
              className="button is-small"
              disabled={undos.length === 0}
              onClick={() => dispatch({ type: "undo" })}
            >
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
  const { state, dispatch } = useContext(StoreContext);
  const { teams } = state;
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
              {teams.list.map((t) => {
                return (
                  <tr
                    key={t.name}
                    className={t.name === teams.next ? "is-selected" : ""}
                  >
                    <td
                      onClick={() =>
                        dispatch({ type: "select_team", name: t.name })
                      }
                    >
                      {t.name}
                    </td>
                    <td
                      onClick={() =>
                        dispatch({ type: "select_team", name: t.name })
                      }
                    >
                      {t.placed.map((taken, index) => {
                        const isLast = index + 1 === t.placed.length;
                        return (
                          <span
                            key={index}
                            className={taken ? "has-text-grey-light" : ""}
                          >
                            {t.name}
                            <sub>{index + 1}</sub>
                            {!isLast && ", "}
                          </span>
                        );
                      })}
                    </td>
                    <td>
                      <AddRemoveMembers />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="field">
        <div className="control">
          <button className="button is-primary" disabled>
            <span className="icon">
              <i className="fas fa-users"></i>
            </span>
            <span>Add Team</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <Navigation />
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
                  Add / Remove Teams
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
