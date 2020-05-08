import React from "react";
import { useContext } from "react";
import { StoreContext } from "./store.js";

export function Progress() {
  const { state } = useContext(StoreContext);
  const { teams } = state;
  const total = teams.list.reduce((sum, team) => team.placed.length + sum, 0);
  const remaining = teams.list.reduce((sum, team) => team.remaining + sum, 0);
  const done = total - remaining;
  const fractionDone = done / total;
  const completed = done === total;
  const faces = [
    // "sad-cry",
    // "frown",
    "meh",
    "smile",
    "smile-beam",
    "grin-stars",
  ];
  const face = faces[Math.floor(fractionDone * (faces.length - 1))];
  return (
    <div className="box">
      <div className="columns is-mobile is-vcentered">
        <div className="column is-10">
          <progress
            className={`progress is-small ${completed ? "is-success" : ""}`}
            value={done}
            max={total}
          >
            {100 * fractionDone}%
          </progress>
        </div>
        <div className="column is-2 has-text-centered">
          <span className="icon is-medium">
            <i className={`far fa-${face} fa-2x`}></i>
          </span>
        </div>
      </div>
    </div>
  );
}
