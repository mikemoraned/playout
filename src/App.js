import React from "react";
import { useReducer } from "react";
import "./App.scss";
import { Navigation } from "./Navigation";

function positionFor(x, y) {
  return `${x}_${y}`;
}

function memberFor(teamName, index) {
  return {
    id: `${teamName}_${index}`,
    team: teamName,
    index,
  };
}

const initialState = {
  teams: {
    list: [
      {
        name: "A",
        next: 0,
        placed: [false, false, false],
        remaining: 3,
      },
      {
        name: "B",
        next: 0,
        placed: [false, false],
        remaining: 2,
      },
      {
        name: "C",
        next: 0,
        placed: [false, false, false, false],
        remaining: 4,
      },
    ],
    next: "A",
  },
  grid: {
    width: 10,
    height: 10,
    seats: [],
    occupied: [],
  },
  undos: [],
};

function addRandomSeats(grid) {
  for (let x = 0; x < grid.width; x++) {
    for (let y = 0; y < grid.height; y++) {
      if (Math.random() < 0.5) {
        grid.seats.push(positionFor(x, y));
      }
    }
  }
}

addRandomSeats(initialState.grid);

function teamWithMemberPlaced(team, member) {
  const placed = [...team.placed];
  placed[member.index] = true;
  const next = placed.findIndex((taken) => !taken);

  return {
    ...team,
    placed,
    next,
    remaining: team.remaining - 1,
  };
}

function teamWithMemberReturned(team, member) {
  const placed = [...team.placed];
  placed[member.index] = false;
  const next = placed.findIndex((taken) => !taken);

  return {
    ...team,
    placed,
    next,
    remaining: team.remaining + 1,
  };
}

function teamListWithReplacedTeam(list, team) {
  return list.map((t) => {
    if (t.name === team.name) {
      return team;
    } else {
      return t;
    }
  });
}

function togglePlaceMemberAction(position) {
  return {
    type: "toggle_place_member",
    position,
    undoable: true,
  };
}

function reducer(state, action) {
  console.dir(action);
  const { grid, teams, undos } = state;

  switch (action.type) {
    case "toggle_place_member":
      let { occupied } = grid;
      const { seats } = grid;
      const { position } = action;

      const hasSeat = seats.indexOf(position) !== -1;

      const newUndos = action.undoable
        ? undos.concat([
            {
              type: "toggle_place_member",
              position,
              undoable: false,
            },
          ])
        : undos;

      const currentOccupancy = occupied.find((o) => o.position === position);
      if (currentOccupancy) {
        occupied = occupied.filter(
          (o) => o.member.id !== currentOccupancy.member.id
        );
        const team = teams.list.find(
          (t) => t.name === currentOccupancy.member.team
        );

        return {
          ...state,
          teams: {
            ...teams,
            list: teamListWithReplacedTeam(
              teams.list,
              teamWithMemberReturned(team, currentOccupancy.member)
            ),
          },

          grid: {
            ...grid,
            occupied,
          },

          undos: newUndos,
        };
      } else {
        const hasNextTeam = teams.next !== null;
        if (hasNextTeam) {
          let nextTeam = teams.list.find((t) => t.name === teams.next);
          const member = memberFor(nextTeam.name, nextTeam.next);

          if (nextTeam.remaining > 0 && hasSeat) {
            const newOccupancy = {
              position,
              member,
            };
            occupied = occupied.concat([newOccupancy]);
            nextTeam = teamWithMemberPlaced(nextTeam, member);

            return {
              ...state,
              teams: {
                ...teams,
                list: teamListWithReplacedTeam(teams.list, nextTeam),
              },
              grid: {
                ...grid,
                occupied,
              },
              undos: newUndos,
            };
          }
        }
      }

      return state;

    case "undo":
      const withUndoRemoved = [...undos];
      const undoAction = withUndoRemoved.pop();
      return reducer({ ...state, undos: withUndoRemoved }, undoAction);

    case "select_team":
      const { name } = action;
      return {
        ...state,
        teams: {
          ...teams,
          next: name,
        },
      };

    default:
      throw new Error();
  }
}

function Grid({ grid, dispatch }) {
  const { width, height, seats, occupied } = grid;
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
        <button className="button" disabled>
          <span className="icon">
            <i className="fas fa-plus"></i>
          </span>
        </button>
        <button className="button" disabled>
          <span className="icon">
            <i className="fas fa-minus"></i>
          </span>
        </button>
      </div>
    </div>
  );
}

function TeamsMini({ teams, undos, dispatch }) {
  return (
    <div className="field is-horizontal">
      <div className="field-label is-normal">
        <label className="label">Next from:</label>
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
                    onClick={() =>
                      dispatch({ type: "select_team", name: t.name })
                    }
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

function TeamsFull({ teams, dispatch }) {
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
            Add Team
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <div className="App">
      <Navigation />
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
              <TeamsMini
                teams={state.teams}
                undos={state.undos}
                dispatch={dispatch}
              />
              <Grid grid={state.grid} dispatch={dispatch} />
            </section>
          </div>
          <div className="column">
            <section className="section">
              <h1 className="title is-4">Teams</h1>
              <p className="subtitle is-6">Add / Remove Teams</p>
              <TeamsFull teams={state.teams} dispatch={dispatch} />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
