import React from "react";
import { useContext, useState } from "react";
import { observer } from "mobx-react";
import { StoreContext } from "../model/store.js";
import { Progress } from "./Progress";
import { Rules } from "./Rules";

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
  const { store } = useContext(StoreContext);
  const { score } = store.evaluation;
  const { progress } = store.evaluation;
  const completed = progress.value === progress.max;

  return <ScoreFaceIcon {...score} size="medium" success={completed} />;
});

const Score = observer(() => {
  const [showRules, setShowRules] = useState(false);
  return (
    <>
      <button className="button" onClick={() => setShowRules(true)}>
        <ScoreFace />
      </button>
      {showRules && (
        <div className="modal is-active has-text-justified">
          <div className="modal-background"></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Scoring</p>
              <button
                className="delete"
                aria-label="close"
                onClick={() => setShowRules(false)}
              ></button>
            </header>
            <section className="modal-card-body">
              <Rules />
            </section>
            <footer className="modal-card-foot"></footer>
          </div>
        </div>
      )}
    </>
  );
});

export const Evaluation = observer(() => {
  const { store } = useContext(StoreContext);
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
          <Score />
        </div>
      </div>
    </div>
  );
});
