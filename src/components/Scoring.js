import React from "react";
import { useContext } from "react";
import { observer } from "mobx-react";
import { StoreContext, TutorialContext } from "../model/contexts.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMeh,
  faSmile,
  faSmileBeam,
  faGrinStars,
} from "@fortawesome/pro-regular-svg-icons";
import {
  faSignal1,
  faSignal2,
  faSignal3,
  faSignal4,
  faSignal,
} from "@fortawesome/pro-solid-svg-icons";

function mapScoreToCategory(score, max, numCategories) {
  const fractionDone = score / max;
  return Math.floor(fractionDone * (numCategories - 1));
}

export function ScoreFaceIcon({ max, score, size }) {
  const faces = [
    // faSadCry,
    // faFrown,
    faMeh,
    faSmile,
    faSmileBeam,
    faGrinStars,
  ];
  const face = faces[mapScoreToCategory(score, max, faces.length)];
  return (
    <span className={`icon is-${size}`}>
      <FontAwesomeIcon icon={face} size={size === "medium" ? "2x" : "1x"} />
    </span>
  );
}

function SignalIcon({ max, score, size }) {
  const icons = [faSignal1, faSignal2, faSignal3, faSignal4, faSignal];
  const icon = icons[mapScoreToCategory(score, max, icons.length)];
  return (
    <span className={`icon is-${size} fa-layers`}>
      <FontAwesomeIcon icon={faSignal} style={{ color: "lightgray" }} />
      {score !== 0 && <FontAwesomeIcon icon={icon} />}
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
      <SignalIcon {...scoring} size={size} />
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

export const Scoring = observer(() => {
  const { store } = useContext(StoreContext);
  const { showTutorial, setShowTutorial } = useContext(TutorialContext);
  const { scoring } = store.evaluation;
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
        onClick={() => setShowTutorial(true)}
        disabled={showTutorial}
      >
        <ScoreFaceWithScore scoring={scoring} size="medium" />
      </button>
    </>
  );
});
