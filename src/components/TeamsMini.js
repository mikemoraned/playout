import React from "react";
import { useContext } from "react";
import { observer } from "mobx-react";
import { StoreContext } from "../model/contexts.js";
import { ScoreFaceIcon } from "./Scoring.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

export const TeamsMini = observer(() => {
  const { store } = useContext(StoreContext);
  const { scoring } = store.evaluation;
  return (
    <div className="teams-mini buttons are-medium has-addons">
      <button
        className="button is-medium"
        disabled={!store.hasPlacements()}
        onClick={() => store.removeAllPlacements()}
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
            className={`button team team-${t.name.toLowerCase()} ${
              isNext ? "is-primary" : ""
            }`}
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
