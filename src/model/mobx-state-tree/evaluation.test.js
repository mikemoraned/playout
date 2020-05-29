import { BiasKind } from "./bias";
import { testStore } from "./testStore";
import { positionFor } from "./grid";

let store = {};

beforeEach(() => {
  store = testStore();
});

describe("bias evaluation", () => {
  test("with all default NEXT_TO biases, but no-one placed, score is maximum", () => {
    expect(store.evaluation.score.value).toEqual(store.evaluation.score.max);
    store.teams.list.forEach((t) => {
      const teamScore = store.evaluation.score.teams[t.name];
      expect(teamScore.value).toEqual(teamScore.max);
    });
  });
  test("NEXT_TO bias is met if all placed team members are next to the other team", () => {
    store.rotateBias("A", "B");
    expect(store.teams.biases.getBias("A", "B")).toEqual(BiasKind.NEXT_TO);
    expect(store.teams.biases.getBias("B", "A")).toEqual(BiasKind.NEXT_TO);
    store.selectTeam("A");
    store.toggleMemberPlacement(positionFor(0, 0));
    store.selectTeam("B");
    store.toggleMemberPlacement(positionFor(1, 1));

    ["A", "B"].forEach((name) => {
      const teamScore = store.evaluation.score.teams[name];
      expect(teamScore.value).toEqual(teamScore.max);
    });
  });

  test("NEXT_TO bias is not met if all team members are not next to the other team", () => {
    store.rotateBias("A", "B");
    expect(store.teams.biases.getBias("A", "B")).toEqual(BiasKind.NEXT_TO);
    expect(store.teams.biases.getBias("B", "A")).toEqual(BiasKind.NEXT_TO);
    store.selectTeam("A");
    store.toggleMemberPlacement(positionFor(0, 0));

    expect(store.evaluation.score.teams["A"].value).toEqual(50);
    expect(store.evaluation.score.teams["B"].value).toEqual(100);
  });
});
