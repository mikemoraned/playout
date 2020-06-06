import { BiasKind } from "./bias";
import { testStore } from "./testStore";
import { positionFor } from "./grid";

let store = {};

beforeEach(() => {
  store = testStore();
});

describe("bias evaluation", () => {
  test("with all default NEXT_TO biases, but no-one placed, score is maximum", () => {
    expect(store.evaluation.scoring.score).toEqual(
      store.evaluation.scoring.max
    );
    store.teams.list.forEach((t) => {
      const teamScore = store.evaluation.scoring.teams[t.name];
      expect(teamScore.score).toEqual(teamScore.max);
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
      const teamScore = store.evaluation.scoring.teams[name];
      expect(teamScore.score).toEqual(teamScore.max);
    });
  });

  test("NEXT_TO bias is not met if all team members are not next to the other team", () => {
    store.rotateBias("A", "B");
    expect(store.teams.biases.getBias("A", "B")).toEqual(BiasKind.NEXT_TO);
    expect(store.teams.biases.getBias("B", "A")).toEqual(BiasKind.NEXT_TO);
    store.selectTeam("A");
    store.toggleMemberPlacement(positionFor(0, 0));

    expect(store.evaluation.scoring.teams["A"].score).toEqual(500);
    expect(store.evaluation.scoring.teams["B"].score).toEqual(1000);
  });
});
