import React from "react";
import { useContext } from "react";
import { observer } from "mobx-react";
import { StoreContext } from "../model/store.js";
import { BiasKind, canRotate } from "../model/bias";
import { ScoreFaceIcon } from "./Evaluation";

const iconForBiasKind = {};
iconForBiasKind[BiasKind.DISTANT] = "fas fa-user-slash";
iconForBiasKind[BiasKind.NO_BIAS] = "fas fa-asterisk";
iconForBiasKind[BiasKind.NEARBY] = "fas fa-user-friends fa-lg";
iconForBiasKind[BiasKind.NEXT_TO] = "fas fa-users fa-lg";
iconForBiasKind[BiasKind.NEXT_TO_SAME_TEAM] = iconForBiasKind[BiasKind.NEXT_TO];

const Bias = observer(({ biasKind, fromTeamName, toTeamName }) => {
  const { store } = useContext(StoreContext);
  const disabled = !canRotate(biasKind);

  return (
    <button
      className="button is-small"
      onClick={() => store.rotateBias(fromTeamName, toTeamName)}
      title={biasKind}
      disabled={disabled}
    >
      <span className="icon">
        <i className={`${iconForBiasKind[biasKind]}`}></i>
      </span>
    </button>
  );
});

export const Biases = observer(() => {
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
            const score = store.evaluation.score.teams[fromTeam.name];
            return (
              <th key={fromTeam.name}>
                {fromTeam.name} <ScoreFaceIcon {...score} size="small" />{" "}
              </th>
            );
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
});