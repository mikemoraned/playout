import { BiasKind } from "./teams/bias";
import { expandToNextToArea, positionCompare } from "./grid/grid";

export function availableProvisionsForAnyTeamBiases(store, thisTeamName) {
  return allBiasKindsForTeam(store, thisTeamName).flatMap((biasKind) =>
    availableProvisions(store, thisTeamName, biasKind)
  );
}

function allBiasKindsForTeam(store, thisTeamName) {
  const biasKinds = store.teams.list.reduce(
    (biasKinds, otherTeam) =>
      biasKinds.add(store.teams.biases.getBias(thisTeamName, otherTeam.name)),
    new Set()
  );
  return Array.from(biasKinds);
}

export function availableProvisions(store, thisTeamName, biasKind) {
  console.log("availableProvisions", thisTeamName, biasKind);
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
    [BiasKind.NEXT_TO_SAME_TEAM, BiasKind.NEXT_TO].forEach((biasKind) => {
      console.log("biasKind", biasKind);
      const otherTeamsWithThisBias = store.teams.list.filter((otherTeam) => {
        const otherTeamName = otherTeam.name;
        return (
          store.teams.biases.getBias(thisTeamName, otherTeamName) === biasKind
        );
      });
      totalPossible += otherTeamsWithThisBias.length * thisTeam.size;
      const specialisedFlows = specialiseFlowToBiasKind(
        store,
        biasKind,
        thisTeamName,
        possibleGenericFlows
      );
      const actualProviders = findProvided(store, specialisedFlows);
      totalActual += actualProviders.length;
    });
    console.log(
      thisTeamName,
      "totalActual",
      totalActual,
      "totalPossible",
      totalPossible
    );
    const fractionComplete =
      totalPossible === 0 ? 0.0 : totalActual / totalPossible;
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
  console.log("provided", thisTeamName, biasKind);
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
  provided.sort((lhs, rhs) => {
    if (lhs.position === rhs.position) {
      return lhs.team.localeCompare(rhs.team);
    } else {
      return positionCompare(lhs.position, rhs.position);
    }
  });
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
  return filterOutSelfProvidingFlows(possibleGenericFlows).map((flow) => {
    return {
      ...flow,
      providingTeam: thisTeamName,
    };
  });
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
  return specialisedFlows;
}

function findAvailableProvisions(store, specialisedFlows) {
  const alreadyProvidedPositions = findProvided(store, specialisedFlows).reduce(
    (positions, provided) => positions.add(provided.position),
    new Set()
  );
  const filterOutUnavailable = specialisedFlows.filter((flow) => {
    return (
      !alreadyProvidedPositions.has(flow.receivingPosition) &&
      !store.grid.hasOccupancy(flow.providingPosition)
    );
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
  const teamsForPosition = new Map();
  positionsWithTeams.forEach((positionWithTeam) => {
    const position = positionWithTeam.position;
    const team = positionWithTeam.team;
    if (teamsForPosition.has(position)) {
      teamsForPosition.set(position, teamsForPosition.get(position).add(team));
    } else {
      teamsForPosition.set(position, new Set().add(team));
    }
  });
  const positions = Array.from([...teamsForPosition.keys()]);
  positions.sort();
  return positions.flatMap((position) => {
    return Array.from(teamsForPosition.get(position)).map((team) => {
      return {
        position,
        team,
      };
    });
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
