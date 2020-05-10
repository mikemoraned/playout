export const BiasKind = Object.freeze({
  DISTANT: "distant",
  NONE: "none",
  NEARBY: "nearby",
  NEXT_TO: "next_to",
});

// export const nextBias = {};
// nextBias[BiasKind.DISTANT] = BiasKind.NONE;
// nextBias[BiasKind.NONE] = BiasKind.NEARBY;
// nextBias[BiasKind.NEARBY] = BiasKind.NEXT_TO;
// nextBias[BiasKind.NEXT_TO] = BiasKind.DISTANT;

export const nextBias = {};
nextBias[BiasKind.NONE] = BiasKind.NEARBY;
nextBias[BiasKind.NEARBY] = BiasKind.NONE;

export function biasKey(fromTeamName, toTeamName) {
  return `${fromTeamName}.${toTeamName}`;
}

export function biasesFor(teamList) {
  const biases = {};
  for (let fromIndex = 0; fromIndex < teamList.length; fromIndex++) {
    for (let toIndex = 0; toIndex < teamList.length; toIndex++) {
      const key = biasKey(teamList[fromIndex].name, teamList[toIndex].name);
      if (fromIndex === toIndex) {
        biases[key] = null;
      } else {
        biases[key] = BiasKind.NONE;
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
        newBiases[key] = null;
      } else {
        if (biases[key]) {
          newBiases[key] = biases[key];
        } else {
          newBiases[key] = BiasKind.NONE;
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
