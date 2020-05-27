import { testStore } from "./testStore";
import { BiasKind, biasKey, Biases } from "./bias";
import { memberFor } from "./team";
import { getSnapshot } from "mobx-state-tree";
import { Store } from "./store";

let store = null;

beforeEach(() => {
  store = testStore();
});

describe("team member biases", () => {
  test("no bias by default", () => {
    const expectedBiases = Biases.create();
    expectedBiases.setBias("A", "A", BiasKind.NEXT_TO_SAME_TEAM);
    expectedBiases.setBias("A", "B", BiasKind.NO_BIAS);
    expectedBiases.setBias("B", "A", BiasKind.NO_BIAS);
    expectedBiases.setBias("B", "B", BiasKind.NEXT_TO_SAME_TEAM);
    expect(store.teams.biases).toEqual(expectedBiases);
  });
  // test("rotate bias symetrically for each team", () => {
  //   const stateAfter = reducer(state, rotateBiasAction("A", "B"));
  //   const expectedBiases = {};
  //   expectedBiases[biasKey("A", "A")] = BiasKind.NEXT_TO_SAME_TEAM;
  //   expectedBiases[biasKey("A", "B")] = BiasKind.NEXT_TO;
  //   expectedBiases[biasKey("B", "A")] = BiasKind.NEXT_TO;
  //   expectedBiases[biasKey("B", "B")] = BiasKind.NEXT_TO_SAME_TEAM;
  //   expect(stateAfter.teams.biases).toEqual(expectedBiases);
  // });
});
