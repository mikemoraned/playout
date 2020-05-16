import { reducer } from "./reducer";
import { togglePlaceMemberAction } from "./action";
import { memberFor } from "./team";
import { positionFor, expandToNextToArea } from "./grid";
import { testStore } from "./testStore";

let state = {};

beforeEach(() => {
  state = testStore();
});

describe("team member placement", () => {
  test("no seat is occupied by default", () => {
    expect(state.grid.occupied).toEqual([]);
  });

  test("toggle place member on unoccupied seat", () => {
    expect(state.grid.occupied).toEqual([]);
    const stateAfterToggle = reducer(
      state,
      togglePlaceMemberAction(positionFor(0, 0))
    );
    expect(stateAfterToggle.teams.list).toEqual([
      {
        canAdd: true,
        name: "A",
        next: 1,
        placed: [true, false],
        remaining: 1,
      },
      {
        canAdd: true,
        name: "B",
        next: 0,
        placed: [false, false, false],
        remaining: 3,
      },
    ]);
    expect(stateAfterToggle.grid.occupied).toEqual([
      {
        member: memberFor("A", 0),
        position: positionFor(0, 0),
      },
    ]);
  });

  test("toggle place member on occupied seat", () => {
    expect(state.grid.occupied).toEqual([]);
    const stateAfterFirstToggle = reducer(
      state,
      togglePlaceMemberAction(positionFor(0, 0))
    );
    const stateAfterSecondToggle = reducer(
      stateAfterFirstToggle,
      togglePlaceMemberAction(positionFor(0, 0))
    );
    expect(stateAfterSecondToggle.teams).toEqual(state.teams);
    expect(stateAfterSecondToggle.grid).toEqual(state.grid);
  });

  test("toggle place member on position with no seat", () => {
    expect(state.grid.occupied).toEqual([]);
    const stateAfterToggle = reducer(
      state,
      togglePlaceMemberAction(positionFor(0, 1))
    );
    expect(stateAfterToggle.teams).toEqual(state.teams);
    expect(stateAfterToggle.grid).toEqual(state.grid);
  });
});

describe("positions and areas", () => {
  test("can expand to next_to area", () => {
    const position = positionFor(1, 1);
    const expanded = expandToNextToArea(position, { width: 3, height: 3 });
    expect(expanded).toEqual([
      positionFor(0, 0),
      positionFor(0, 1),
      positionFor(0, 2),
      positionFor(1, 0),
      positionFor(1, 2),
      positionFor(2, 0),
      positionFor(2, 1),
      positionFor(2, 2),
    ]);
  });

  test("can expand to next_to area, excluding outside area", () => {
    const position = positionFor(0, 2);
    const expanded = expandToNextToArea(position, { width: 3, height: 3 });
    expect(expanded).toEqual([
      positionFor(0, 1),
      positionFor(1, 1),
      positionFor(1, 2),
    ]);
  });
});