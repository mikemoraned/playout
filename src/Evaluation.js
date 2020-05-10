import React from "react";
import { useContext } from "react";
import { StoreContext } from "./model/store.js";

function Progress() {
  const { state } = useContext(StoreContext);
  const { progress } = state.evaluation;
  const fractionDone = progress.value / (progress.max - progress.min);
  const completed = progress.value === progress.done;

  return (
    <progress
      className={`progress is-small ${completed ? "is-success" : ""}`}
      value={progress.value}
      max={progress.max}
    >
      {100 * fractionDone}%
    </progress>
  );
}

export function ScoreFaceIcon({ min, max, value, size }) {
  const faces = [
    // "sad-cry",
    // "frown",
    "meh",
    "smile",
    "smile-beam",
    "grin-stars",
  ];
  const fractionDone = value / (max - min);
  const face = faces[Math.floor(fractionDone * (faces.length - 1))];
  return (
    <span className={`icon is-${size}`}>
      <i className={`far fa-${face} ${size === "medium" ? "fa-2x" : ""}`}></i>
    </span>
  );
}

function ScoreFace() {
  const { state } = useContext(StoreContext);
  const { score } = state.evaluation;

  return <ScoreFaceIcon {...score} size="medium" />;
}

export function Evaluation() {
  return (
    <div className="box">
      <div className="columns is-mobile is-vcentered">
        <div className="column is-10">
          <Progress />
        </div>
        <div className="column is-2 has-text-centered">
          <ScoreFace />
        </div>
      </div>
    </div>
  );
}
