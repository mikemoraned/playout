import React from "react";
import { useContext } from "react";
import { observer } from "mobx-react";
import { StoreContext } from "../model/contexts.js";
import { ScoreFaceIcon } from "./Scoring.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faUndo } from "@fortawesome/pro-regular-svg-icons";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

export const TeamsMini = observer(() => {
  const { store } = useContext(StoreContext);
  const { scoring } = store.evaluation;
  return (
    <div className="buttons are-medium has-addons">
      {/* <button
        className="button is-medium"
        disabled={!store.canUndo()}
        onClick={() => store.undo()}
      >
        <span className="icon">
          <FontAwesomeIcon icon={faUndo} size="1x" />
        </span>
      </button> */}
      <button
        className="button is-medium"
        disabled={!store.canResetPlacements()}
        onClick={() => store.resetPlacements()}
      >
        <span className="icon">
          <FontAwesomeIcon icon={faTrashAlt} />
        </span>
      </button>

      {store.teams.list.map((t) => {
        const isNext = store.teams.next === t.name;
        const teamScoring = scoring.teams[t.name];
        return (
          <button
            key={t.name}
            className={`button ${isNext ? "is-primary" : ""}`}
            onClick={() => store.selectTeam(t.name)}
          >
            <ScoreFaceIcon {...teamScoring} />
            <span>
              {t.name}:{" "}
              <span style={{ fontFamily: "monospace" }}>{t.remaining}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
});
