import React from "react";
import { useContext } from "react";
import { StoreContext } from "./store.js";

export function Progress() {
  const { state } = useContext(StoreContext);
  const { teams } = state;
  const total = teams.list.reduce((sum, team) => team.placed.length + sum, 0);
  const remaining = teams.list.reduce((sum, team) => team.remaining + sum, 0);
  const done = total - remaining;
  const percentageDone = (100 * done) / total;
  const completed = done === total;
  return (
    <div className="box">
      <progress
        className={`progress is-small ${completed ? "is-success" : ""}`}
        value={done}
        max={total}
      >
        {percentageDone}%
      </progress>
    </div>
  );
}
