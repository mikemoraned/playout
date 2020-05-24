import { testStore } from "./testStore";
import { teamFor } from "./team";
import { getSnapshot } from "mobx-state-tree";
import { Store } from "./store";

let store = null;

beforeEach(() => {
  store = testStore();
});

describe("team selection", () => {
  test("default selected team is first team", () => {
    expect(store.teams.next).toBe("A");
  });

  test("can select team by name", () => {
    store.selectTeam("B");
    expect(store.teams.next).toBe("B");
  });

  test("select unknown team throws Error", () => {
    expect(() => {
      store.selectTeam("C");
    }).toThrowError(/^unknown team: C$/);
  });
});

describe("team editing", () => {
  test("can add new team when below limit", () => {
    const before = Store.create(getSnapshot(store));
    store.addTeam();
    expect(store.teams.next).toBe("A");
    expect(store.teams.list.length).toEqual(3);
    expect(store.teams.list[2]).toEqual(teamFor("C", 3));
    expect(store.teams.list.slice(0, 2)).toEqual(before.teams.list);
  });

  // test("indicates cannot add team when at limit", () => {
  //   expect(state.teams.canAdd).toEqual(true);
  //   const stateAfter = reducer(state, addTeamAction());
  //   expect(stateAfter.teams.canAdd).toEqual(false);
  // });

  // test("cannot add team when at limit", () => {
  //   const stateWhenAtLimit = reducer(state, addTeamAction());
  //   expect(() => {
  //     reducer(stateWhenAtLimit, addTeamAction());
  //   }).toThrowError(/^cannot add team$/);
  // });

  // test("can expand biases", () => {
  //   const stateAfter = reducer(state, addTeamAction());
  //   const expectedBiases = {};
  //   expectedBiases[biasKey("A", "A")] = BiasKind.NEXT_TO_SAME_TEAM;
  //   expectedBiases[biasKey("A", "B")] = BiasKind.NO_BIAS;
  //   expectedBiases[biasKey("A", "C")] = BiasKind.NO_BIAS;

  //   expectedBiases[biasKey("B", "A")] = BiasKind.NO_BIAS;
  //   expectedBiases[biasKey("B", "B")] = BiasKind.NEXT_TO_SAME_TEAM;
  //   expectedBiases[biasKey("B", "C")] = BiasKind.NO_BIAS;

  //   expectedBiases[biasKey("C", "A")] = BiasKind.NO_BIAS;
  //   expectedBiases[biasKey("C", "B")] = BiasKind.NO_BIAS;
  //   expectedBiases[biasKey("C", "C")] = BiasKind.NEXT_TO_SAME_TEAM;

  //   expect(stateAfter.teams.biases).toEqual(expectedBiases);
  // });
});
