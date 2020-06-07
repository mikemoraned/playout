import React from "react";
import { useContext } from "react";
import { observer } from "mobx-react";
import { StoreContext } from "../model/store.js";

export const Progress = observer(() => {
  const { store } = useContext(StoreContext);
  const { progress } = store.evaluation;
  const fractionDone = progress.value / (progress.max - progress.min);
  const completed = progress.value === progress.max;

  return (
    <progress
      className={`progress is-small ${completed ? "is-success" : ""}`}
      value={progress.value}
      max={progress.max}
    >
      {100 * fractionDone}%
    </progress>
  );
});
