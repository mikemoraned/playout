import React from "react";
import { useContext } from "react";
import { StoreContext } from "./model/store.js";
import { rotateBiasAction } from "./model/action";
import { biasKey, BiasKind } from "./model/bias";
import { ScoreFaceIcon } from "./Evaluation";

const iconForBiasKind = {};
iconForBiasKind[BiasKind.DISTANT] = "fas fa-user-slash";
iconForBiasKind[BiasKind.NONE] = "";
iconForBiasKind[BiasKind.NEARBY] = "fas fa-user-friends fa-lg";
iconForBiasKind[BiasKind.NEXT_TO] = "fas fa-users fa-lg";

function Bias({ biasKind, fromTeamName, toTeamName }) {
  const { dispatch } = useContext(StoreContext);
  return (
    <button
      className="button is-small"
      onClick={() => dispatch(rotateBiasAction(fromTeamName, toTeamName))}
    >
      <span className="icon">
        <i className={`${iconForBiasKind[biasKind]}`}></i>
      </span>
    </button>
  );
}

function Self() {
  return (
    <span className="icon has-text-grey-light">
      <i className="fas fa-slash fa-sm"></i>
    </span>
  );
}

export function Biases() {
  const { state } = useContext(StoreContext);
  const { teams } = state;
  const { biases } = teams;
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
                const key = biasKey(fromTeam.name, toTeam.name);
                const bias = biases[key];
                if (bias === null) {
                  return (
                    <td key={key}>
                      <Self />
                    </td>
                  );
                } else {
                  return (
                    <td key={key}>
                      <Bias
                        biasKind={bias}
                        fromTeamName={fromTeam.name}
                        toTeamName={toTeam.name}
                      />
                    </td>
                  );
                }
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
