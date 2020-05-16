import { reducer } from "./reducer";
import { selectTeamAction, addTeamAction, addTeamMemberAction } from "./action";
import { teamFor } from "./team";
import { biasKey, BiasKind } from "./bias";
import { testStore } from "./testStore";

let state = {};

beforeEach(() => {
  state = testStore();
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

  test("can expand biases", () => {
    const stateAfter = reducer(state, addTeamAction());
    const expectedBiases = {};
    expectedBiases[biasKey("A", "A")] = BiasKind.NEXT_TO_SAME_TEAM;
    expectedBiases[biasKey("A", "B")] = BiasKind.NO_BIAS;
    expectedBiases[biasKey("A", "C")] = BiasKind.NO_BIAS;

    expectedBiases[biasKey("B", "A")] = BiasKind.NO_BIAS;
    expectedBiases[biasKey("B", "B")] = BiasKind.NEXT_TO_SAME_TEAM;
    expectedBiases[biasKey("B", "C")] = BiasKind.NO_BIAS;

    expectedBiases[biasKey("C", "A")] = BiasKind.NO_BIAS;
    expectedBiases[biasKey("C", "B")] = BiasKind.NO_BIAS;
    expectedBiases[biasKey("C", "C")] = BiasKind.NEXT_TO_SAME_TEAM;

    expect(stateAfter.teams.biases).toEqual(expectedBiases);
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
