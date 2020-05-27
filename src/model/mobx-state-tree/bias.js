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

export function biasKey(fromTeamName, toTeamName) {
  return `${fromTeamName}.${toTeamName}`;
}

export const Biases = types
  .model("Biases", {
    biases: types.map(types.string, types.string),
  })
  .actions((self) => ({
    setBias(fromTeamName, toTeamName, biasKind) {
      const key = biasKey(fromTeamName, toTeamName);
      self.biases[key] = biasKind;
    },
  }));

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
