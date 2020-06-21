import React from "react";
import { useContext } from "react";
import { observer } from "mobx-react";
import { StoreContext } from "../model/contexts.js";
import { Progress } from "./Progress";
import { Scoring } from "./Scoring";

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
        <div className="column is-6">
          <Progress />
        </div>
        <div className="column is-4 has-text-centered">
          <Scoring />
        </div>
      </div>
    </div>
  );
});
