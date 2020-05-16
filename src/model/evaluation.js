import { biasKey, BiasKind } from "./bias";
import { expandToNextToArea } from "./grid";

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

function evaluateTeamScore(state, thisTeamName, scoreLimits) {
  const { teams } = state;
  const { biases } = teams;
  let satisfiedBiases = 0;
  let biasesEvaluated = 0;
  for (let toIndex = 0; toIndex < teams.list.length; toIndex++) {
    const otherTeamName = teams.list[toIndex].name;
    const key = biasKey(thisTeamName, otherTeamName);
    const bias = biases[key];
    if (bias) {
      biasesEvaluated++;
      if (bias === BiasKind.NO_BIAS) {
        satisfiedBiases++;
      } else if (bias === BiasKind.NEXT_TO) {
        if (nextToMemberOfOtherTeam(state, thisTeamName, otherTeamName)) {
          satisfiedBiases++;
        }
      } else if (bias === BiasKind.NEXT_TO_SAME_TEAM) {
        if (nextToMemberOfSameTeam(state, thisTeamName, otherTeamName)) {
          satisfiedBiases++;
        }
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

function nextToMemberOfOtherTeam(state, thisTeamName, otherTeamName) {
  const otherTeamPositions = state.grid.occupied
    .filter((o) => o.member.team === otherTeamName)
    .map((o) => o.position);
  const positionsNextToOtherTeam = otherTeamPositions.reduce(
    (positionsNextToOtherTeamSoFar, position) =>
      expandToNextToArea(position, state.grid).reduce(
        (positions, position) => positions.add(position),
        positionsNextToOtherTeamSoFar
      ),
    new Set()
  );

  const thisTeamPositions = state.grid.occupied
    .filter((o) => o.member.team === thisTeamName)
    .map((o) => o.position);

  return thisTeamPositions.every((thisTeamPosition) =>
    positionsNextToOtherTeam.has(thisTeamPosition)
  );
}

function nextToMemberOfSameTeam(state, thisTeamName) {
  const thisTeamOccupancies = state.grid.occupied.filter(
    (o) => o.member.team === thisTeamName
  );

  if (thisTeamOccupancies.length === 1) {
    return true;
  } else {
    return thisTeamOccupancies.every((thisTeamOccupancy) => {
      const otherTeamMemberOccupancies = thisTeamOccupancies.filter((o) => {
        return o.member.id !== thisTeamOccupancy.member.id;
      });
      const otherTeamMemberPositions = otherTeamMemberOccupancies.map(
        (o) => o.position
      );
      const positionsNextToOtherTeamMembers = otherTeamMemberPositions.reduce(
        (positionsNextToOtherTeamMembersSoFar, position) =>
          expandToNextToArea(position, state.grid).reduce(
            (positions, position) => positions.add(position),
            positionsNextToOtherTeamMembersSoFar
          ),
        new Set()
      );
      return positionsNextToOtherTeamMembers.has(thisTeamOccupancy.position);
    });
  }
}
