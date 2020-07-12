import React from "react";
import { useContext } from "react";
import { observer } from "mobx-react";
import { StoreContext } from "../model/contexts.js";
import { Progress } from "./Progress";
import { Scoring } from "./Scoring";
import { NextProblem } from "./NextProblem";

export const Evaluation = observer(() => {
  const { store } = useContext(StoreContext);
  const { progress } = store.evaluation;
  const percentDone = (
    (100 * progress.value) /
    (progress.max - progress.min)
  ).toFixed(0);
  const nonBreakingSpace = "\xa0";
  return (
    <div className={`evaluation box grade-${store.grade.name.toLowerCase()}`}>
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
        <div className="column is-4 has-text-centered">
          <Scoring />
        </div>
        <div className="column is-3 has-text-centered">
          <NextProblem />
        </div>
      </div>
    </div>
  );
});
