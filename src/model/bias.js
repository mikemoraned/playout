import { types } from "mobx-state-tree";

export const BiasKind = Object.freeze({
  DISTANT: "distant",
  NO_BIAS: "no_bias",
  NEARBY: "nearby",
  NEXT_TO: "next_to",
  NEXT_TO_SAME_TEAM: "next_to_same_team",
});

export const nextBias = {};
nextBias[BiasKind.NO_BIAS] = BiasKind.NEXT_TO;
nextBias[BiasKind.NEXT_TO] = BiasKind.NO_BIAS;

export function canRotate(biasKind) {
  return biasKind === BiasKind.NEXT_TO || biasKind === BiasKind.NO_BIAS;
}

export const Biases = types
  .model("Biases", {
    biases: types.map(types.string),
  })
  .actions((self) => ({
    setBias(fromTeamName, toTeamName, biasKind) {
      const forwardKey = biasKey(fromTeamName, toTeamName);
      const backwardKey = biasKey(toTeamName, fromTeamName);
      self.biases[forwardKey] = biasKind;
      self.biases[backwardKey] = biasKind;
    },
    rotateBias(fromTeamName, toTeamName) {
      const current = self.getBias(fromTeamName, toTeamName);
      const next = nextBias[current];
      self.setBias(fromTeamName, toTeamName, next);
    },
    expandBiases(teamList) {
      for (let fromIndex = 0; fromIndex < teamList.length; fromIndex++) {
        for (let toIndex = 0; toIndex < teamList.length; toIndex++) {
          const fromTeamName = teamList[fromIndex].name;
          const toTeamName = teamList[toIndex].name;
          if (fromIndex === toIndex) {
            self.setBias(fromTeamName, toTeamName, BiasKind.NEXT_TO_SAME_TEAM);
          } else {
            if (!self.getBias(fromTeamName, toTeamName)) {
              self.setBias(fromTeamName, toTeamName, BiasKind.NO_BIAS);
            }
          }
        }
      }
    },
  }))
  .views((self) => ({
    getBias(fromTeamName, toTeamName) {
      const forwardKey = biasKey(fromTeamName, toTeamName);
      return self.biases[forwardKey];
    },
  }));

function biasKey(fromTeamName, toTeamName) {
  return `${fromTeamName}.${toTeamName}`;
}

export function biasesFor(teamList) {
  const biases = Biases.create();
  for (let fromIndex = 0; fromIndex < teamList.length; fromIndex++) {
    for (let toIndex = 0; toIndex < teamList.length; toIndex++) {
      const fromTeamName = teamList[fromIndex].name;
      const toTeamName = teamList[toIndex].name;
      if (fromIndex === toIndex) {
        biases.setBias(fromTeamName, toTeamName, BiasKind.NEXT_TO_SAME_TEAM);
      } else {
        biases.setBias(fromTeamName, toTeamName, BiasKind.NO_BIAS);
      }
    }
  }
  return biases;
}
