import React from "react";
import { useContext } from "react";
import { StoreContext, biasKey, BiasKind } from "./store.js";

const iconForBiasKind = {};
iconForBiasKind[BiasKind.DISTANT] = "fas fa-user-slash";
iconForBiasKind[BiasKind.NONE] = "";
iconForBiasKind[BiasKind.NEARBY] = "fas fa-user-friends fa-lg";
iconForBiasKind[BiasKind.NEXT_TO] = "fas fa-users fa-lg";

function Bias({ biasKind, key }) {
  return (
    <button className="button is-small">
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

  return (
    <table className="table is-narrow" style={{ tableLayout: "fixed" }}>
      <thead>
        <tr>
          <th colSpan={teams.length + 1}>Proximity:</th>
        </tr>
        <tr>
          <th>from:</th>
          {teams.list.map((fromTeam) => {
            return <th key={fromTeam.name}>{fromTeam.name}</th>;
          })}
        </tr>
      </thead>
      <tbody>
        {teams.list.map((toTeam) => {
          return (
            <tr key={toTeam.name}>
              <td>to {toTeam.name}:</td>
              {teams.list.map((fromTeam) => {
                const key = biasKey(fromTeam, toTeam);
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
                      <Bias biasKind={bias} key={key} />
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
