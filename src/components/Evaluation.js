import React from "react";
import { useContext, useState } from "react";
import { observer } from "mobx-react";
import { useHistory } from "react-router-dom";
import { StoreContext } from "../model/contexts.js";
import { Progress } from "./Progress";
import { Scoring } from "./Scoring";
import { randomProblemWithGridSize } from "../model/problem.js";

export const NextProblem = observer(() => {
  const history = useHistory();
  const [isLoading, setLoading] = useState(false);
  const { store } = useContext(StoreContext);
  const { progress } = store.evaluation;
  const complete = progress.value === progress.max;

  function visitRandomProblem() {
    const problem = randomProblemWithGridSize(
      store.grid.width,
      store.grid.height
    );
    const path = `/play/${problem.grid.toVersion2Format()}/${problem.teams.toVersion1Format()}`;
    setLoading(true);
    setTimeout(() => {
      history.push(path);
      setLoading(false);
    }, 1000);
  }

  return (
    <>
      <button
        className={`button is-hidden-mobile ${isLoading ? "is-loading" : ""}`}
        disabled={!complete}
        onClick={() => visitRandomProblem()}
      >
        <span>Next</span>
        <span className="icon">
          <i className="fas fa-angle-double-right"></i>
        </span>
      </button>
      <button
        className={`button is-hidden-tablet ${isLoading ? "is-loading" : ""}`}
        disabled={!complete}
        onClick={() => visitRandomProblem()}
      >
        <span className="icon">
          <i className="fas fa-angle-double-right fa-2x"></i>
        </span>
      </button>
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
        <div className="column is-narrow has-text-right">
          <span
            style={{
              fontFamily: "monospace",
            }}
          >
            {percentDone.padStart(3, nonBreakingSpace)}%
          </span>
        </div>
        <div className="column">
          <Progress />
        </div>
        <div className="column is-3 has-text-centered">
          <Scoring />
        </div>
        <div className="column is-3 has-text-centered">
          <NextProblem />
        </div>
      </div>
    </div>
  );
});
