import React from "react";
import { useContext } from "react";
import { observer } from "mobx-react";
import { StoreContext } from "../model/contexts.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare } from "@fortawesome/pro-duotone-svg-icons";
import { faArrowsH } from "@fortawesome/pro-solid-svg-icons";

export const BiasesMini = observer(({ scrollToRef }) => {
  const { store } = useContext(StoreContext);

  const scroll = () => window.scrollTo(0, scrollToRef.current.offsetTop);

  return (
    <div className="biases-mini is-size-6 buttons are-small has-addons is-centered is-info is-light">
      {store.teams.list.map((fromTeam) => {
        return (
          <TeamBiasButton
            fromTeam={fromTeam}
            toTeams={store.teams.teamsWithBiasesFromTeam(fromTeam)}
            onClick={scroll}
            key={fromTeam.name}
          />
        );
      })}
    </div>
  );
});

function TeamBiasButton({ fromTeam, toTeams, onClick }) {
  return (
    <div className="button" onClick={onClick}>
      <TeamBiasIcons fromTeam={fromTeam} toTeams={toTeams} />
    </div>
  );
}

export function TeamBiasIcons({ fromTeam, toTeams }) {
  const otherTeams = toTeams.filter((toTeam) => toTeam.name !== fromTeam.name);
  const toTeamsWithFromTeamFirst = [fromTeam].concat(otherTeams);
  return (
    <span className="team-bias" style={{ whiteSpace: "nowrap" }}>
      <span
        className={`icon ml-0 mr-0 team team-${fromTeam.name.toLowerCase()}`}
      >
        <FontAwesomeIcon icon={faSquare} />
      </span>
      <span className="icon ml-0 mr-0">
        <FontAwesomeIcon icon={faArrowsH} />
      </span>
      {toTeamsWithFromTeamFirst.map((toTeam) => {
        return (
          <span
            className={`icon ml-0 mr-0 team team-${toTeam.name.toLowerCase()}`}
            key={toTeam.name}
          >
            <FontAwesomeIcon icon={faSquare} />
          </span>
        );
      })}
    </span>
  );
}

export function TeamBiasText({ fromTeam, toTeams }) {
  const otherTeams = toTeams.filter((toTeam) => toTeam.name !== fromTeam.name);
  if (otherTeams.length > 0) {
    return (
      <span>
        Team {fromTeam.name} members want to be next to team-mates and also{" "}
        {otherTeams.map((t) => t.name).join(", ")} members.
      </span>
    );
  } else {
    return (
      <span>
        Team {fromTeam.name} members want to be next to other team-mates.
      </span>
    );
  }
}
