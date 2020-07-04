import React from "react";
import { useContext } from "react";
import { observer } from "mobx-react";
import { StoreContext } from "../model/contexts.js";
import { ScoreFaceIcon } from "./Scoring.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faUndo } from "@fortawesome/free-solid-svg-icons";

export const TeamsMini = observer(() => {
  const { store } = useContext(StoreContext);
  const { scoring } = store.evaluation;
  return (
    <div className="field is-horizontal">
      <div className="field-label is-normal">
        <label className="label">
          Next{" "}
          <span className="icon">
            <FontAwesomeIcon icon={faUser} />
          </span>{" "}
          from:
        </label>
      </div>
      <div className="field-body">
        <div className="field is-grouped">
          <div className="control">
            <div className="buttons are-small has-addons">
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
                      {t.name} ({t.remaining})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="control">
            <button
              className="button is-small"
              disabled={!store.canUndo()}
              onClick={() => store.undo()}
            >
              <span className="icon">
                <FontAwesomeIcon icon={faUndo} />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});
