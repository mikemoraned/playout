import {
  storeFor,
  teamsFor,
  teamFor,
  memberFor,
  gridFor,
  positionFor,
  reducer,
  selectTeamAction,
  togglePlaceMemberAction,
  undoAction,
} from "./store";

let state = {};

beforeEach(() => {
  state = storeFor(teamsFor([teamFor("A", 2), teamFor("B", 3)]), gridFor(2, 2));
  state.grid.seats = [positionFor(0, 0), positionFor(1, 1)];
});

describe("team selection", () => {
  test("default selected team is first team", () => {
    expect(state.teams.next).toBe("A");
  });

  test("can select team by name", () => {
    const stateAfter = reducer(state, selectTeamAction("B"));
    expect(stateAfter.teams.next).toBe("B");
  });

  test("select unknown team throws Error", () => {
    expect(() => {
      reducer(state, selectTeamAction("C"));
    }).toThrowError(/^unknown team: C$/);
  });
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
        name: "A",
        next: 1,
        placed: [true, false],
        remaining: 1,
      },
      {
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
