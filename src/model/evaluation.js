import { BiasKind } from "./teams/bias";
import { expandToNextToArea } from "./grid/grid";

export function evaluate(store) {
  return {
    progress: evaluateProgress(store),
    scoring: evaluateScore(store),
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

function evaluateScore(store) {
  const scoreLimits = {
    max: 1000,
  };
  const perTeamScores = {};
  let scoreSum = 0;
  store.teams.list.forEach((t) => {
    const score = evaluateTeamScore(store, t.name, scoreLimits);
    perTeamScores[t.name] = score;
    scoreSum += score.score;
  });
  const overallScore = Math.floor(scoreSum / store.teams.list.length);
  return {
    ...scoreLimits,
    score: overallScore,
    teams: perTeamScores,
  };
}

function evaluateTeamScore(store, thisTeamName, scoreLimits) {
  const { teams } = store;
  const { biases } = teams;
  let satisfiedBiases = 0;
  let biasesEvaluated = 0;
  for (let toIndex = 0; toIndex < teams.list.length; toIndex++) {
    const otherTeamName = teams.list[toIndex].name;
    const bias = biases.getBias(thisTeamName, otherTeamName);
    biasesEvaluated++;
    if (bias === BiasKind.NO_BIAS) {
      satisfiedBiases++;
    } else if (bias === BiasKind.NEXT_TO) {
      if (nextToMemberOfOtherTeam(store, thisTeamName, otherTeamName)) {
        satisfiedBiases++;
      }
    } else if (bias === BiasKind.NEXT_TO_SAME_TEAM) {
      if (nextToMemberOfSameTeam(store, thisTeamName, otherTeamName)) {
        satisfiedBiases++;
      }
    }
  }

  const fractionComplete = satisfiedBiases / biasesEvaluated;
  const scoreValue = Math.floor(scoreLimits.max * fractionComplete);

  return {
    ...scoreLimits,
    score: scoreValue,
  };
}

function nextToMemberOfOtherTeam(store, thisTeamName, otherTeamName) {
  const otherTeamPositions = store.grid.occupied
    .filter((o) => o.member.team === otherTeamName)
    .map((o) => o.position);
  const positionsNextToOtherTeam = otherTeamPositions.reduce(
    (positionsNextToOtherTeamSoFar, position) =>
      expandToNextToArea(position, store.grid).reduce(
        (positions, position) => positions.add(position),
        positionsNextToOtherTeamSoFar
      ),
    new Set()
  );

  const thisTeamPositions = store.grid.occupied
    .filter((o) => o.member.team === thisTeamName)
    .map((o) => o.position);

  return thisTeamPositions.every((thisTeamPosition) =>
    positionsNextToOtherTeam.has(thisTeamPosition)
  );
}

function nextToMemberOfSameTeam(store, thisTeamName) {
  const thisTeamOccupancies = store.grid.occupied.filter(
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
          expandToNextToArea(position, store.grid).reduce(
            (positions, position) => positions.add(position),
            positionsNextToOtherTeamMembersSoFar
          ),
        new Set()
      );
      return positionsNextToOtherTeamMembers.has(thisTeamOccupancy.position);
    });
  }
}
