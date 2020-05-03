import React from "react";
import { useContext } from "react";
import "./App.scss";
import {
  StoreContext,
  selectTeamAction,
  addTeamAction,
  addTeamMemberAction,
  removeTeamMemberAction,
} from "./store.js";

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

function AddRemoveMembers({ team }) {
  const { dispatch } = useContext(StoreContext);
  return (
    <div className="field is-grouped">
      <div className="buttons are-small has-addons">
        <button
          className="button"
          disabled={!team.canAdd}
          onClick={() => dispatch(addTeamMemberAction(team.name))}
        >
          <span className="icon">
            <i className="fas fa-user-plus"></i>
          </span>
        </button>
        <button
          className="button"
          onClick={() => dispatch(removeTeamMemberAction(team.name))}
        >
          <span className="icon">
            <i className="fas fa-user-minus"></i>
          </span>
        </button>
      </div>
    </div>
  );
}

export function TeamsFull() {
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
                <th>
                  <AddRemoveMembersHeader />
                </th>
                <th>Members</th>
              </tr>
            </thead>
            <tbody>
              {teams.list.map((t) => {
                return (
                  <tr
                    key={t.name}
                    className={t.name === teams.next ? "is-selected" : ""}
                  >
                    <td onClick={() => dispatch(selectTeamAction(t.name))}>
                      {t.name}
                    </td>
                    <td>
                      <AddRemoveMembers team={t} />
                    </td>
                    <td onClick={() => dispatch(selectTeamAction(t.name))}>
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
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="field">
        <div className="control">
          <button
            className="button is-primary"
            disabled={!teams.canAdd}
            onClick={() => dispatch(addTeamAction())}
          >
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
