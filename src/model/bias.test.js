import { reducer } from "./reducer";
import { rotateBiasAction } from "./action";
import { biasKey, BiasKind } from "./bias";
import { testStore } from "./testStore";

let state = {};

beforeEach(() => {
  state = testStore();
});

describe("team member biases", () => {
  test("no bias by default", () => {
    const expectedBiases = {};
    expectedBiases[biasKey("A", "A")] = null;
    expectedBiases[biasKey("A", "B")] = BiasKind.NONE;
    expectedBiases[biasKey("B", "A")] = BiasKind.NONE;
    expectedBiases[biasKey("B", "B")] = null;

    expect(state.teams.biases).toEqual(expectedBiases);
  });

  test("rotate bias symetrically for each team", () => {
    const stateAfter = reducer(state, rotateBiasAction("A", "B"));
    const expectedBiases = {};
    expectedBiases[biasKey("A", "A")] = null;
    expectedBiases[biasKey("A", "B")] = BiasKind.NEARBY;
    expectedBiases[biasKey("B", "A")] = BiasKind.NEARBY;
    expectedBiases[biasKey("B", "B")] = null;

    expect(stateAfter.teams.biases).toEqual(expectedBiases);
  });
});
