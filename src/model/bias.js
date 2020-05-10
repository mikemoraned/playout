export const BiasKind = Object.freeze({
  DISTANT: "distant",
  NO_BIAS: "no_bias",
  NEARBY: "nearby",
  NEXT_TO: "next_to",
  NEXT_TO_SAME_TEAM: "next_to_same_team",
});

// export const nextBias = {};
// nextBias[BiasKind.DISTANT] = BiasKind.NO_BIAS;
// nextBias[BiasKind.NO_BIAS] = BiasKind.NEARBY;
// nextBias[BiasKind.NEARBY] = BiasKind.NEXT_TO;
// nextBias[BiasKind.NEXT_TO] = BiasKind.DISTANT;

export const nextBias = {};
nextBias[BiasKind.NO_BIAS] = BiasKind.NEXT_TO;
nextBias[BiasKind.NEXT_TO] = BiasKind.NO_BIAS;

export function canRotate(biasKind) {
  return biasKind === BiasKind.NEXT_TO || biasKind === BiasKind.NO_BIAS;
}

export function biasKey(fromTeamName, toTeamName) {
  return `${fromTeamName}.${toTeamName}`;
}

export function biasesFor(teamList) {
  const biases = {};
  for (let fromIndex = 0; fromIndex < teamList.length; fromIndex++) {
    for (let toIndex = 0; toIndex < teamList.length; toIndex++) {
      const key = biasKey(teamList[fromIndex].name, teamList[toIndex].name);
      if (fromIndex === toIndex) {
        biases[key] = BiasKind.NEXT_TO_SAME_TEAM;
      } else {
        biases[key] = BiasKind.NO_BIAS;
      }
    }
  }
  return biases;
}

export function expandBiases(biases, teamList) {
  const newBiases = { ...biases };
  for (let fromIndex = 0; fromIndex < teamList.length; fromIndex++) {
    for (let toIndex = 0; toIndex < teamList.length; toIndex++) {
      const key = biasKey(teamList[fromIndex].name, teamList[toIndex].name);
      if (fromIndex === toIndex) {
        newBiases[key] = BiasKind.NEXT_TO_SAME_TEAM;
      } else {
        if (biases[key]) {
          newBiases[key] = biases[key];
        } else {
          newBiases[key] = BiasKind.NO_BIAS;
        }
      }
    }
  }
  return newBiases;
}

export function rotateBias(biases, fromTeamName, toTeamName) {
  const newBiases = {
    ...biases,
  };
  const forwardKey = biasKey(fromTeamName, toTeamName);
  const backwardKey = biasKey(toTeamName, fromTeamName);

  if (biases[forwardKey] !== null && biases[backwardKey] !== null) {
    const next = nextBias[biases[forwardKey]];
    newBiases[forwardKey] = next;
    newBiases[backwardKey] = next;
  }
  return newBiases;
}
