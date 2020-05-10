import { reducer } from "./reducer";
import { togglePlaceMemberAction, undoAction } from "./action";
import { positionFor } from "./grid";
import { testStore } from "./testStore";

let state = {};

beforeEach(() => {
  state = testStore();
});

describe("undo", () => {
  test("undo toggle", () => {
    expect(state.grid.occupied).toEqual([]);
    expect(state.undos).toEqual([]);

    const stateAfterToggle = reducer(
      state,
      togglePlaceMemberAction(positionFor(0, 0))
    );
    expect(stateAfterToggle.undos).toEqual([
      { position: "0_0", type: "toggle_place_member", undoable: false },
    ]);

    const stateAfterUndo = reducer(stateAfterToggle, undoAction());
    expect(stateAfterUndo.teams).toEqual(state.teams);
    expect(stateAfterUndo.grid).toEqual(state.grid);
    expect(stateAfterUndo.undos).toEqual([]);
  });
});
