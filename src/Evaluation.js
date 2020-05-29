import React from "react";
import { useContext } from "react";
import { observer } from "mobx-react";
import { MobXStoreContext } from "./model/store.js";

const Progress = observer(() => {
  const { store } = useContext(MobXStoreContext);
  const { progress } = store.evaluation;
  const fractionDone = progress.value / (progress.max - progress.min);
  const completed = progress.value === progress.max;

  return (
    <progress
      className={`progress is-small ${completed ? "is-success" : ""}`}
      value={progress.value}
      max={progress.max}
    >
      {100 * fractionDone}%
    </progress>
  );
});

export function ScoreFaceIcon({ min, max, value, size, success }) {
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
    <span className={`icon is-${size} ${success ? "has-text-success" : ""}`}>
      <i className={`far fa-${face} ${size === "medium" ? "fa-2x" : ""}`}></i>
    </span>
  );
}

const ScoreFace = observer(() => {
  const { store } = useContext(MobXStoreContext);
  const { score } = store.evaluation;
  const { progress } = store.evaluation;
  const completed = progress.value === progress.max;

  return <ScoreFaceIcon {...score} size="medium" success={completed} />;
});

export const Evaluation = observer(() => {
  const { store } = useContext(MobXStoreContext);
  const { progress } = store.evaluation;
  const percentDone = (
    (100 * progress.value) /
    (progress.max - progress.min)
  ).toFixed(0);
  const nonBreakingSpace = "\xa0";
  return (
    <div className="box">
      <div className="columns is-mobile is-vcentered">
        <div className="column is-2 has-text-right">
          <span
            style={{
              fontFamily: "monospace",
            }}
          >
            {percentDone.padStart(3, nonBreakingSpace)}%
          </span>
        </div>
        <div className="column is-8">
          <Progress />
        </div>
        <div className="column is-2 has-text-centered">
          <ScoreFace />
        </div>
      </div>
    </div>
  );
});
