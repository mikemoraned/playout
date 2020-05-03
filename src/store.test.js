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
  addTeamAction,
  templateFor,
  addTeamMemberAction,
  removeTeamMemberAction,
} from "./store";

let state = {};

beforeEach(() => {
  const defaultSize = 3;
  const maximumSize = 4;
  state = storeFor(
    teamsFor(
      [teamFor("A", 2), teamFor("B", 3)],
      templateFor(["A", "B", "C"], defaultSize, maximumSize)
    ),
    gridFor(2, 2)
  );
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

describe("team editing", () => {
  test("can add new team when below limit", () => {
    const stateAfter = reducer(state, addTeamAction());
    expect(stateAfter.teams.next).toBe("A");
    expect(stateAfter.teams.list.length).toEqual(3);
    expect(stateAfter.teams.list[2]).toEqual(teamFor("C", 3));
    expect(stateAfter.teams.list.slice(0, 2)).toEqual(state.teams.list);
  });

  test("indicates cannot add team when at limit", () => {
    expect(state.teams.canAdd).toEqual(true);
    const stateAfter = reducer(state, addTeamAction());
    expect(stateAfter.teams.canAdd).toEqual(false);
  });

  test("cannot add team when at limit", () => {
    const stateWhenAtLimit = reducer(state, addTeamAction());
    expect(() => {
      reducer(stateWhenAtLimit, addTeamAction());
    }).toThrowError(/^cannot add team$/);
  });
});

describe("team member editing", () => {
  test("can add team member", () => {
    const stateAfter = reducer(state, addTeamMemberAction("B"));
    expect(stateAfter.teams.list.length).toEqual(state.teams.list.length);
    expect(stateAfter.teams.list[0]).toEqual(state.teams.list[0]);
    const expected = teamFor("B", 4);
    expected.canAdd = false;
    expect(stateAfter.teams.list[1]).toEqual(expected);
  });

  test("can remove team member with no team occupancies", () => {
    const stateAfter = reducer(state, removeTeamMemberAction("B"));
    expect(stateAfter.teams.list.length).toEqual(state.teams.list.length);
    expect(stateAfter.teams.list[0]).toEqual(state.teams.list[0]);
    expect(stateAfter.teams.list[1]).toEqual(teamFor("B", 2));
    expect(stateAfter.grid).toEqual(state.grid);
  });

  test("can remove team member with different team member occupancy", () => {
    const stateWithOccupancyOfDifferentMember = chainActions(state, [
      selectTeamAction("B"),
      togglePlaceMemberAction(positionFor(0, 0)),
    ]);

    const expectedBeforeRemoval = teamFor("B", 3);
    expectedBeforeRemoval.next = 1;
    expectedBeforeRemoval.remaining = 2;
    expectedBeforeRemoval.placed[0] = true;
    expect(stateWithOccupancyOfDifferentMember.teams.list[1]).toEqual(
      expectedBeforeRemoval
    );

    const stateAfter = reducer(
      stateWithOccupancyOfDifferentMember,
      removeTeamMemberAction("B")
    );

    expect(stateAfter.grid).toEqual(stateWithOccupancyOfDifferentMember.grid);

    expect(stateAfter.teams.list.length).toEqual(state.teams.list.length);
    expect(stateAfter.teams.list[0]).toEqual(state.teams.list[0]);

    const expectedAfterRemoval = teamFor("B", 2);
    expectedAfterRemoval.next = 1;
    expectedAfterRemoval.remaining = 1;
    expectedAfterRemoval.placed[0] = true;
    expect(stateAfter.teams.list[1]).toEqual(expectedAfterRemoval);
  });

  test("can remove team member which has an occupancy", () => {
    const stateWithOverlappingOccupancy = chainActions(state, [
      selectTeamAction("B"),
      togglePlaceMemberAction(positionFor(0, 0)),
      togglePlaceMemberAction(positionFor(1, 1)),
    ]);

    const expectedBeforeRemoval = teamFor("B", 3);
    expectedBeforeRemoval.next = 2;
    expectedBeforeRemoval.remaining = 1;
    expectedBeforeRemoval.placed[0] = true;
    expectedBeforeRemoval.placed[1] = true;
    expect(stateWithOverlappingOccupancy.teams.list[1]).toEqual(
      expectedBeforeRemoval
    );

    expect(stateWithOverlappingOccupancy.grid.occupied).toEqual([
      {
        member: memberFor("B", 0),
        position: positionFor(0, 0),
      },
      {
        member: memberFor("B", 1),
        position: positionFor(1, 1),
      },
    ]);

    const stateAfter = chainActions(stateWithOverlappingOccupancy, [
      removeTeamMemberAction("B"),
      removeTeamMemberAction("B"),
    ]);

    expect(stateAfter.grid.occupied).toEqual([
      {
        member: memberFor("B", 0),
        position: positionFor(0, 0),
      },
    ]);

    expect(stateAfter.teams.list.length).toEqual(state.teams.list.length);
    expect(stateAfter.teams.list[0]).toEqual(state.teams.list[0]);

    const expectedAfterRemoval = teamFor("B", 1);
    expectedAfterRemoval.next = 1;
    expectedAfterRemoval.remaining = 0;
    expectedAfterRemoval.placed[0] = true;

    expect(stateAfter.teams.list[1]).toEqual(expectedAfterRemoval);
  });

  test("indicates cannot add team member when at limit", () => {
    expect(state.teams.list[1].canAdd).toEqual(true);
    const stateAfter = reducer(state, addTeamMemberAction("B"));
    expect(stateAfter.teams.list[1].canAdd).toEqual(false);
  });

  test("cannot add team member when at limit", () => {
    const stateWhenAtLimit = reducer(state, addTeamMemberAction("B"));
    expect(() => {
      reducer(stateWhenAtLimit, addTeamMemberAction("B"));
    }).toThrowError(/^cannot add team member$/);
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

function chainActions(state, actions) {
  if (actions.length === 0) {
    return state;
  } else {
    const [first, rest] = [actions[0], actions.slice(1)];
    return chainActions(reducer(state, first), rest);
  }
}
