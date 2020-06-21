import React from "react";
import { useContext, useState } from "react";
import { observer } from "mobx-react";
import { StoreContext } from "../model/store.js";
import { Rules } from "./Rules";
import "./Scoring.scss";

function mapScoreToCategory(score, max, numCategories) {
  const fractionDone = score / max;
  return Math.floor(fractionDone * (numCategories - 1));
}

export function ScoreFaceIcon({ max, score, size }) {
  const faces = [
    // "sad-cry",
    // "frown",
    "meh",
    "smile",
    "smile-beam",
    "grin-stars",
  ];
  const face = faces[mapScoreToCategory(score, max, faces.length)];
  return (
    <span className={`icon is-${size}`}>
      <i className={`far fa-${face} ${size === "medium" ? "fa-2x" : ""}`}></i>
    </span>
  );
}

export function ScoreFaceWithScore({ scoring, size }) {
  const nonBreakingSpace = "\xa0";
  return (
    <>
      <ScoreFaceIcon {...scoring} size={size} />
      {nonBreakingSpace}
      <span
        style={{
          fontFamily: "monospace",
        }}
      >
        {scoring.score.toFixed(0).padStart(4, nonBreakingSpace)}
      </span>
    </>
  );
}

export const ScoringBreakdown = observer(() => {
  const { store } = useContext(StoreContext);
  const { scoring } = store.evaluation;
  const teamNames = store.teams.names;

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Team</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        {teamNames.map((n) => {
          return (
            <tr key={n}>
              <td>{n}</td>
              <td>
                <ScoreFaceWithScore scoring={scoring.teams[n]} />
              </td>
            </tr>
          );
        })}
      </tbody>
      <tfoot>
        <tr>
          <td>Overall</td>
          <td>
            <ScoreFaceWithScore scoring={scoring} />
          </td>
        </tr>
      </tfoot>
    </table>
  );
});

export const ScoringBreakdownModal = ({ closeCallback }) => {
  return (
    <div className="modal is-active has-text-justified">
      <div className="modal-background"></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Scoring</p>
          <button
            className="delete"
            aria-label="close"
            onClick={() => closeCallback()}
          ></button>
        </header>
        <section className="modal-card-body">
          <ScoringBreakdown />
          <Rules />
        </section>
        <footer className="modal-card-foot"></footer>
      </div>
    </div>
  );
};

export const Scoring = observer(() => {
  const { store } = useContext(StoreContext);
  const { scoring } = store.evaluation;
  const [showBreakdown, setShowBreakdown] = useState(false);
  const buttonKinds = [
    "is-info",
    "is-warning",
    "is-success",
    "is-success woopwoop",
  ];
  const buttonKind =
    buttonKinds[
      mapScoreToCategory(scoring.score, scoring.max, buttonKinds.length)
    ];
  return (
    <>
      <button
        className={`button scoring ${buttonKind}`}
        onClick={() => setShowBreakdown(true)}
      >
        <ScoreFaceWithScore scoring={scoring} size="medium" />
      </button>
      {showBreakdown && (
        <ScoringBreakdownModal closeCallback={() => setShowBreakdown(false)} />
      )}
    </>
  );
});
