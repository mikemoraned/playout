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
    expectedBiases[biasKey("A", "A")] = BiasKind.NEXT_TO_SAME_TEAM;
    expectedBiases[biasKey("A", "B")] = BiasKind.NO_BIAS;
    expectedBiases[biasKey("B", "A")] = BiasKind.NO_BIAS;
    expectedBiases[biasKey("B", "B")] = BiasKind.NEXT_TO_SAME_TEAM;

    expect(state.teams.biases).toEqual(expectedBiases);
  });

  test("rotate bias symetrically for each team", () => {
    const stateAfter = reducer(state, rotateBiasAction("A", "B"));
    const expectedBiases = {};
    expectedBiases[biasKey("A", "A")] = BiasKind.NEXT_TO_SAME_TEAM;
    expectedBiases[biasKey("A", "B")] = BiasKind.NEXT_TO;
    expectedBiases[biasKey("B", "A")] = BiasKind.NEXT_TO;
    expectedBiases[biasKey("B", "B")] = BiasKind.NEXT_TO_SAME_TEAM;

    expect(stateAfter.teams.biases).toEqual(expectedBiases);
  });
});
