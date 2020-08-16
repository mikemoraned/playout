import { evaluateScoringFromProvided } from "./explainable_evaluation";

export function evaluate(store) {
  return {
    progress: evaluateProgress(store),
    scoring: evaluateScoringFromProvided(store),
  };
}

function evaluateProgress(store) {
  const progressLimits = {
    min: 0,
    max: 100,
  };
  const total = store.teams.list.reduce(
    (sum, team) => team.placed.length + sum,
    0
  );
  const remaining = store.teams.list.reduce(
    (sum, team) => team.remaining + sum,
    0
  );
  const done = total - remaining;
  const fractionComplete = done / total;
  const progressValue =
    Math.floor((progressLimits.max - progressLimits.min) * fractionComplete) +
    progressLimits.min;
  return {
    ...progressLimits,
    value: progressValue,
  };
}
