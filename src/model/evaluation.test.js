import { reducer } from "./reducer";
import {
  togglePlaceMemberAction,
  rotateBiasAction,
  chainActions,
  selectTeamAction,
} from "./action";
import { biasKey, BiasKind } from "./bias";
import { testStore } from "./testStore";
import { positionFor } from "./grid";

let state = {};

beforeEach(() => {
  state = testStore();
});

describe("bias evaluation", () => {
  test("with all default NEXT_TO biases, but no-one placed, score is maximum", () => {
    expect(state.evaluation.score.value).toEqual(state.evaluation.score.max);
    state.teams.list.forEach((t) => {
      const teamScore = state.evaluation.score.teams[t.name];
      expect(teamScore.value).toEqual(teamScore.max);
    });
  });
  test("NEXT_TO bias is met if all placed team members are next to the other team", () => {
    const stateAfterRotate = reducer(state, rotateBiasAction("A", "B"));
    expect(stateAfterRotate.teams.biases[biasKey("A", "B")]).toEqual(
      BiasKind.NEXT_TO
    );
    expect(stateAfterRotate.teams.biases[biasKey("B", "A")]).toEqual(
      BiasKind.NEXT_TO
    );
    const stateAfterPlacements = chainActions(reducer, stateAfterRotate, [
      selectTeamAction("A"),
      togglePlaceMemberAction(positionFor(0, 0)),
      selectTeamAction("B"),
      togglePlaceMemberAction(positionFor(1, 1)),
    ]);

    ["A", "B"].forEach((name) => {
      const teamScore = stateAfterPlacements.evaluation.score.teams[name];
      expect(teamScore.value).toEqual(teamScore.max);
    });
  });

  test("NEXT_TO bias is not met if all team members are not next to the other team", () => {
    const stateAfterRotate = reducer(state, rotateBiasAction("A", "B"));
    expect(stateAfterRotate.teams.biases[biasKey("A", "B")]).toEqual(
      BiasKind.NEXT_TO
    );
    expect(stateAfterRotate.teams.biases[biasKey("B", "A")]).toEqual(
      BiasKind.NEXT_TO
    );
    const stateAfterPlacements = chainActions(reducer, stateAfterRotate, [
      selectTeamAction("A"),
      togglePlaceMemberAction(positionFor(0, 0)),
    ]);

    expect(stateAfterPlacements.evaluation.score.teams["A"].value).toEqual(50);
    expect(stateAfterPlacements.evaluation.score.teams["B"].value).toEqual(100);
  });
});
