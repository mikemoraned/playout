import { biasKey, BiasKind } from "./bias";

export function evaluate(state) {
  return {
    ...state,
    evaluation: {
      progress: evaluateProgress(state),
      score: evaluateScore(state),
    },
  };
}

function evaluateProgress(state) {
  const progressLimits = {
    min: 0,
    max: 100,
  };
  const total = state.teams.list.reduce(
    (sum, team) => team.placed.length + sum,
    0
  );
  const remaining = state.teams.list.reduce(
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

function evaluateScore(state) {
  const scoreLimits = {
    min: 0,
    max: 100,
  };
  const perTeamScores = {};
  let scoreSum = 0;
  state.teams.list.forEach((t) => {
    const score = evaluateTeamScore(state, t.name, scoreLimits);
    perTeamScores[t.name] = score;
    scoreSum += score.value;
  });
  const overallScore = Math.floor(scoreSum / state.teams.list.length);
  return {
    ...scoreLimits,
    value: overallScore,
    teams: perTeamScores,
  };
}

function evaluateTeamScore(state, teamName, scoreLimits) {
  const { teams } = state;
  const { biases } = teams;
  let satisfiedBiases = 0;
  let biasesEvaluated = 0;
  for (let toIndex = 0; toIndex < teams.list.length; toIndex++) {
    const key = biasKey(teamName, teams.list[toIndex].name);
    const bias = biases[key];
    if (bias) {
      biasesEvaluated++;
      if (bias === BiasKind.NONE) {
        satisfiedBiases++;
      }
    }
  }

  const fractionComplete = satisfiedBiases / biasesEvaluated;
  const scoreValue =
    Math.floor((scoreLimits.max - scoreLimits.min) * fractionComplete) +
    scoreLimits.min;

  return {
    ...scoreLimits,
    value: scoreValue,
  };
}
