import React from "react";
import { useContext } from "react";
import { StoreContext } from "../model/contexts.js";
import { TeamMember } from "./TeamMember";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faUsers } from "@fortawesome/free-solid-svg-icons";

function AddRemoveMembersHeader() {
  return (
    <div>
      <span className="icon">
        <FontAwesomeIcon icon={faUserPlus} />
      </span>
    </div>
  );
}

function AddRemoveMembers({ team }) {
  const { store } = useContext(StoreContext);
  return (
    <div className="field is-grouped">
      <div className="buttons are-small has-addons">
        <button
          className="button"
          disabled={!team.canAdd}
          onClick={() => store.addTeamMember(team.name)}
        >
          <span className="icon">
            <FontAwesomeIcon icon={faUserPlus} />
          </span>
        </button>
      </div>
    </div>
  );
}

export const TeamsFull = observer(() => {
  const { store } = useContext(StoreContext);
  const editable = store.mode.canEditTeams();
  const { teams } = store;
  return (
    <div>
      <div className="field">
        <div className="control">
          <table className="table is-narrow is-hoverable">
            <thead>
              <tr>
                <th>Team</th>
                {editable && (
                  <th>
                    <AddRemoveMembersHeader />
                  </th>
                )}
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
                    <td onClick={() => store.selectTeam(t.name)}>{t.name}</td>
                    {editable && (
                      <td>
                        <AddRemoveMembers team={t} />
                      </td>
                    )}
                    <td onClick={() => store.selectTeam(t.name)}>
                      {t.placed.map((taken, index) => {
                        const isLast = index + 1 === t.placed.length;
                        return (
                          <span
                            key={index}
                            className={taken ? "has-text-grey-light" : ""}
                          >
                            <TeamMember teamName={t.name} number={index + 1} />
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
      {editable && (
        <div className="field">
          <div className="control">
            <button
              className="button is-primary"
              disabled={!teams.canAdd}
              onClick={() => store.addTeam()}
            >
              <span className="icon">
                <FontAwesomeIcon icon={faUsers} />
              </span>
              <span>Add Team</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
});
