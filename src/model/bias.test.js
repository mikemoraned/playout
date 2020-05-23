import { testStore } from "./testStore";
import { BiasKind } from "./bias";

let store = null;

beforeEach(() => {
  store = testStore();
});

describe("team member biases", () => {
  test("no bias by default", () => {
    const biases = store.teams.biases;

    expect(store.teams.biases.getBias("A", "A")).toEqual(
      BiasKind.NEXT_TO_SAME_TEAM
    );
    expect(biases.getBias("A", "B")).toEqual(BiasKind.NO_BIAS);
    expect(biases.getBias("B", "A")).toEqual(BiasKind.NO_BIAS);
    expect(biases.getBias("B", "B")).toEqual(BiasKind.NEXT_TO_SAME_TEAM);
  });
  test("rotate bias symetrically for each team", () => {
    store.rotateBias("A", "B");

    const biases = store.teams.biases;

    expect(biases.getBias("A", "A")).toEqual(BiasKind.NEXT_TO_SAME_TEAM);
    expect(biases.getBias("A", "B")).toEqual(BiasKind.NEXT_TO);
    expect(biases.getBias("B", "A")).toEqual(BiasKind.NEXT_TO);
    expect(biases.getBias("B", "B")).toEqual(BiasKind.NEXT_TO_SAME_TEAM);
  });
});
