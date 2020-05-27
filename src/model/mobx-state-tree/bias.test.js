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
  test("rotate bias symetrically for each team", () => {
    const expectedBiases = Biases.create();
    expectedBiases.setBias("A", "A", BiasKind.NEXT_TO_SAME_TEAM);
    expectedBiases.setBias("A", "B", BiasKind.NEXT_TO);
    expectedBiases.setBias("B", "A", BiasKind.NEXT_TO);
    expectedBiases.setBias("B", "B", BiasKind.NEXT_TO_SAME_TEAM);

    store.rotateBias("A", "B");

    expect(store.teams.biases).toEqual(expectedBiases);
  });
});
