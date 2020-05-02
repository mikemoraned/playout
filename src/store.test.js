import {
  storeFor,
  teamsFor,
  teamFor,
  gridFor,
  reducer,
  selectTeamAction,
} from "./store";

describe("team selection", () => {
  let state = {};

  beforeEach(() => {
    state = storeFor(
      teamsFor([teamFor("A", 2), teamFor("B", 3)], gridFor(2, 2))
    );
  });

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
