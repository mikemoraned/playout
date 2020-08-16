import { BiasKind } from "./teams/bias";
import { expandToNextToArea } from "./grid/grid";

export function availableProvisions(store, thisTeamName, biasKind) {
  console.log("availableProvisions", biasKind);
  const possibleGenericFlows = genericFlows(store, thisTeamName);
  const specialisedFlows = specialiseFlowToBiasKind(
    store,
    biasKind,
    thisTeamName,
    possibleGenericFlows
  );
  return findAvailableProvisions(store, specialisedFlows);
}

export function evaluateScoringFromProvided(store) {
  console.log("evaluateScoringFromProvided");
  const scoreLimits = {
    max: 1000,
  };
  const perTeamScores = {};
  let scoreSum = 0;
  store.teams.list.forEach((thisTeam) => {
    const thisTeamName = thisTeam.name;
    console.log("thisTeamName", thisTeamName);
    const possibleGenericFlows = genericFlows(store, thisTeamName);
    let totalPossible = 0;
    let totalActual = 0;
    store.teams.list.forEach((otherTeam) => {
      const otherTeamName = otherTeam.name;
      console.log("otherTeamName", otherTeamName);
      const biasKind = store.teams.biases.getBias(thisTeamName, otherTeamName);
      if (biasKind === BiasKind.NO_BIAS) {
        // doesn't affect score at all
      } else {
        console.log("biasKind", biasKind);
        totalPossible += thisTeam.size;
        const specialisedFlows = specialiseFlowToBiasKind(
          store,
          biasKind,
          thisTeamName,
          possibleGenericFlows
        );
        const actualProvisions = findProvided(store, specialisedFlows);
        totalActual += actualProvisions.length;
      }
    });
    console.log("actual", totalActual, "possible", totalPossible);
    const fractionComplete = totalActual / totalPossible;
    const scoreValue = Math.floor(scoreLimits.max * fractionComplete);
    const score = {
      ...scoreLimits,
      score: scoreValue,
    };
    perTeamScores[thisTeamName] = score;
    scoreSum += score.score;
  });
  const overallScore = Math.floor(scoreSum / store.teams.list.length);
  return {
    ...scoreLimits,
    score: overallScore,
    teams: perTeamScores,
  };
}

export function provided(store, thisTeamName, biasKind) {
  console.log("provided", biasKind);
  const possibleGenericFlows = genericFlows(store, thisTeamName);
  console.log("generic:", possibleGenericFlows);
  const specialisedFlows = specialiseFlowToBiasKind(
    store,
    biasKind,
    thisTeamName,
    possibleGenericFlows
  );
  console.log("specialised:", specialisedFlows);
  const provided = findProvided(store, specialisedFlows);
  console.log("provided:", provided);
  return provided;
}

function specialiseFlowToBiasKind(
  store,
  biasKind,
  thisTeamName,
  possibleGenericFlows
) {
  if (biasKind === BiasKind.NEXT_TO_SAME_TEAM) {
    return specialiseFlowToNextToSameTeamBiasKind(
      store,
      thisTeamName,
      possibleGenericFlows
    );
  } else if (biasKind === BiasKind.NEXT_TO) {
    return specialiseFlowToNextToBiasKind(
      store,
      thisTeamName,
      possibleGenericFlows
    );
  } else {
    return [];
  }
}

function specialiseFlowToNextToSameTeamBiasKind(
  store,
  thisTeamName,
  possibleGenericFlows
) {
  const thisTeamOccupancies = store.grid.occupied.filter(
    (o) => o.member.team === thisTeamName
  );
  if (thisTeamOccupancies.length === 1) {
    return filterInSelfProvidingFlows(possibleGenericFlows).map((flow) => {
      return {
        ...flow,
        providingTeam: thisTeamName,
      };
    });
  } else {
    return filterOutSelfProvidingFlows(possibleGenericFlows).map((flow) => {
      return {
        ...flow,
        providingTeam: thisTeamName,
      };
    });
  }
}

function specialiseFlowToNextToBiasKind(
  store,
  thisTeamName,
  possibleGenericFlows
) {
  const otherTeamNames = store.teams.list
    .map((t) => t.name)
    .filter((otherTeamName) => {
      const bias = store.teams.biases.getBias(thisTeamName, otherTeamName);
      return bias === BiasKind.NEXT_TO;
    });
  const specialisedFlows = filterOutSelfProvidingFlows(possibleGenericFlows)
    .map((flow) => {
      return otherTeamNames.map((otherTeamName) => {
        return {
          ...flow,
          providingTeam: otherTeamName,
        };
      });
    })
    .flat();
  console.log("nextTo, specialised", specialisedFlows);
  return specialisedFlows;
}

function findAvailableProvisions(store, specialisedFlows) {
  const filterOutUnavailable = specialisedFlows.filter((flow) => {
    return !store.grid.hasOccupancy(flow.providingPosition);
  });
  console.log(filterOutUnavailable);
  return convertFlowsToProviders(filterOutUnavailable);
}

function findProvided(store, specialisedFlows) {
  const takenFlows = specialisedFlows.filter((flow) => {
    const occupancy = store.grid.findOccupancy(flow.providingPosition);
    return occupancy && occupancy.member.team === flow.providingTeam;
  });
  return convertFlowsToReceivers(takenFlows);
}

function convertFlowsToReceivers(flows) {
  return unique(
    flows.map((flow) => {
      return {
        position: flow.receivingPosition,
        team: flow.providingTeam,
      };
    })
  );
}

function convertFlowsToProviders(flows) {
  return unique(
    flows.map((flow) => {
      return {
        position: flow.providingPosition,
        team: flow.providingTeam,
      };
    })
  );
}

function unique(positionsWithTeams) {
  const teamForPosition = new Map();
  positionsWithTeams.forEach((positionWithTeam) => {
    teamForPosition.set(positionWithTeam.position, positionWithTeam.team);
  });
  const positions = Array.from([...teamForPosition.keys()]);
  positions.sort();
  return positions.map((position) => {
    return {
      position,
      team: teamForPosition.get(position),
    };
  });
}

function filterInSelfProvidingFlows(flows) {
  return flows.filter((flow) => {
    return flow.receivingPosition === flow.providingPosition;
  });
}

function filterOutSelfProvidingFlows(flows) {
  return flows.filter((flow) => {
    return flow.receivingPosition !== flow.providingPosition;
  });
}

function genericFlows(store, thisTeamName) {
  const thisTeamOccupancies = store.grid.occupied.filter(
    (o) => o.member.team === thisTeamName
  );
  const possibleGenericFlows = thisTeamOccupancies
    .map((o) => {
      const receivingPosition = o.position;
      const providingPositions = [receivingPosition].concat(
        expandToNextToArea(receivingPosition, store.grid)
      );
      return providingPositions.map((providingPosition) => {
        return { receivingPosition, providingPosition };
      });
    })
    .flat()
    .filter((flow) => {
      return store.grid.hasSeat(flow.providingPosition);
    });
  return possibleGenericFlows;
}
