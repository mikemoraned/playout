import React from "react";
import { useContext } from "react";
import { observer } from "mobx-react";
import { StoreContext } from "../model/contexts.js";
import { BiasKind, canRotate } from "../model/teams/bias";
import { ScoringBreakdown } from "./Scoring";
import { TeamBiasIcons, TeamBiasText } from "./BiasesMini";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserSlash,
  faUserFriends,
  faUsers,
} from "@fortawesome/pro-duotone-svg-icons";
import { faAsterisk } from "@fortawesome/pro-regular-svg-icons";

const iconForBiasKind = {};
iconForBiasKind[BiasKind.DISTANT] = <FontAwesomeIcon icon={faUserSlash} />;
iconForBiasKind[BiasKind.NO_BIAS] = <FontAwesomeIcon icon={faAsterisk} />;
iconForBiasKind[BiasKind.NEARBY] = (
  <FontAwesomeIcon icon={faUserFriends} size="lg" />
);
iconForBiasKind[BiasKind.NEXT_TO] = (
  <FontAwesomeIcon icon={faUsers} size="lg" />
);
iconForBiasKind[BiasKind.NEXT_TO_SAME_TEAM] = iconForBiasKind[BiasKind.NEXT_TO];

const EditableBias = observer(({ biasKind, fromTeamName, toTeamName }) => {
  const { store } = useContext(StoreContext);
  const disabled = !canRotate(biasKind);

  return (
    <button
      className="button is-small"
      onClick={() => store.rotateBias(fromTeamName, toTeamName)}
      title={biasKind}
      disabled={disabled}
    >
      <span className="icon">{iconForBiasKind[biasKind]}</span>
    </button>
  );
});

const EditableBiases = observer(() => {
  const { store } = useContext(StoreContext);

  return (
    <table className="table is-narrow" style={{ tableLayout: "fixed" }}>
      <thead>
        <tr>
          <th colSpan={store.teams.list.length + 1}>Proximity:</th>
        </tr>
        <tr>
          <th>from:</th>
          {store.teams.list.map((fromTeam) => {
            return <th key={fromTeam.name}>{fromTeam.name}</th>;
          })}
        </tr>
      </thead>
      <tbody>
        {store.teams.list.map((toTeam) => {
          return (
            <tr key={toTeam.name}>
              <td>to {toTeam.name}:</td>
              {store.teams.list.map((fromTeam) => {
                const bias = store.teams.biases.getBias(
                  fromTeam.name,
                  toTeam.name
                );
                return (
                  <td key={fromTeam.name}>
                    <EditableBias
                      biasKind={bias}
                      fromTeamName={fromTeam.name}
                      toTeamName={toTeam.name}
                    />
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
});

const BiasesExplanation = observer(() => {
  const { store } = useContext(StoreContext);

  return (
    <div>
      <table className="tut-biases-explanation">
        <tbody>
          {store.teams.list.map((fromTeam) => {
            const toTeams = store.teams.teamsWithBiasesFromTeam(fromTeam);
            return (
              <tr key={fromTeam.name}>
                <td className="team-bias">
                  <TeamBiasIcons fromTeam={fromTeam} toTeams={toTeams} />
                </td>
                <td>
                  <TeamBiasText fromTeam={fromTeam} toTeams={toTeams} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <ScoringBreakdown />
    </div>
  );
});

export const Biases = observer(() => {
  const { store } = useContext(StoreContext);

  if (store.mode.canEditBiases()) {
    return <EditableBiases />;
  } else {
    return <BiasesExplanation />;
  }
});
