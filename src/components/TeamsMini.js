import React from "react";
import { useContext } from "react";
import { observer } from "mobx-react";
import { StoreContext } from "../model/store.js";
import "./animate_team_selection.scss";

export const TeamsMini = observer(() => {
  const { store } = useContext(StoreContext);
  return (
    <div className="field is-horizontal">
      <div className="field-label is-normal">
        <label className="label">
          Next{" "}
          <span className="icon">
            <i className="fas fa-user"></i>
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
                return (
                  <button
                    key={t.name}
                    className={`button ${isNext ? "is-primary" : ""}`}
                    onClick={() => store.selectTeam(t.name)}
                  >
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
                <i className="fas fa-undo"></i>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});
