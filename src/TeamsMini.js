import React from "react";
import { useContext } from "react";
import { observer } from "mobx-react";
import { StoreContext, MobXStoreContext } from "./model/store.js";
import { selectTeamAction, undoAction } from "./model/action";

export const TeamsMini = observer(() => {
  const { state, dispatch } = useContext(StoreContext);
  const { store } = useContext(MobXStoreContext);
  const teams = store.teams;
  const { undos } = state;
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
              {teams.list.map((t) => {
                const isNext = teams.next === t.name;
                return (
                  <button
                    key={t.name}
                    className={`button ${isNext ? "is-primary" : ""}`}
                    onClick={() => dispatch(selectTeamAction(t.name))}
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
              disabled={undos.length === 0}
              onClick={() => dispatch(undoAction())}
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
