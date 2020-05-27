import React from "react";
import { useContext } from "react";
import { StoreContext, MobXStoreContext } from "./model/store.js";
import { rotateBiasAction } from "./model/action";
import { BiasKind, canRotate } from "./model/mobx-state-tree/bias";
import { ScoreFaceIcon } from "./Evaluation";

const iconForBiasKind = {};
iconForBiasKind[BiasKind.DISTANT] = "fas fa-user-slash";
iconForBiasKind[BiasKind.NO_BIAS] = "fas fa-asterisk";
iconForBiasKind[BiasKind.NEARBY] = "fas fa-user-friends fa-lg";
iconForBiasKind[BiasKind.NEXT_TO] = "fas fa-users fa-lg";
iconForBiasKind[BiasKind.NEXT_TO_SAME_TEAM] = iconForBiasKind[BiasKind.NEXT_TO];

function Bias({ biasKind, fromTeamName, toTeamName }) {
  const { dispatch } = useContext(StoreContext);
  const disabled = !canRotate(biasKind);

  return (
    <button
      className="button is-small"
      onClick={() => dispatch(rotateBiasAction(fromTeamName, toTeamName))}
      title={biasKind}
      disabled={disabled}
    >
      <span className="icon">
        <i className={`${iconForBiasKind[biasKind]}`}></i>
      </span>
    </button>
  );
}

export function Biases() {
  const { store } = useContext(MobXStoreContext);
  const { teams } = store;
  const { biases } = teams;

  const { state } = useContext(StoreContext);
  const { evaluation } = state;

  return (
    <table className="table is-narrow" style={{ tableLayout: "fixed" }}>
      <thead>
        <tr>
          <th colSpan={teams.list.length + 1}>Proximity:</th>
        </tr>
        <tr>
          <th>from:</th>
          {teams.list.map((fromTeam) => {
            const score = evaluation.score.teams[fromTeam.name];
            return (
              <th key={fromTeam.name}>
                {fromTeam.name} <ScoreFaceIcon {...score} size="small" />{" "}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {teams.list.map((toTeam) => {
          return (
            <tr key={toTeam.name}>
              <td>to {toTeam.name}:</td>
              {teams.list.map((fromTeam) => {
                const bias = biases.getBias(fromTeam.name, toTeam.name);
                return (
                  <td key={fromTeam.name}>
                    <Bias
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
}
