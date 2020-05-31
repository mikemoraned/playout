import { testStore } from "./testStore";
import { teamFor } from "./team";
import { BiasKind } from "./bias";
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

describe("team information", () => {
  test("total team sizes", () => {
    expect(store.teams.totalMembers).toBe(5);
    store.addTeam();
    expect(store.teams.totalMembers).toBe(8);
  });
});

describe("team editing", () => {
  test("can add new team when below limit", () => {
    const before = Store.create(getSnapshot(store));
    store.addTeam();
    expect(store.teams.next).toBe("A");
    expect(store.teams.list.length).toEqual(3);
    expect(store.teams.list[2]).toEqual(teamFor("C", 3, 4));
    expect(store.teams.list.slice(0, 2)).toEqual(before.teams.list);
  });

  test("indicates cannot add team when at limit", () => {
    expect(store.teams.canAdd).toEqual(true);
    store.addTeam();
    expect(store.teams.canAdd).toEqual(false);
  });

  test("cannot add team when at limit", () => {
    store.addTeam();
    expect(() => {
      store.addTeam();
    }).toThrowError(/^cannot add team$/);
  });

  test("can expand biases", () => {
    store.addTeam();

    const biases = store.teams.biases;

    expect(biases.getBias("A", "A")).toEqual(BiasKind.NEXT_TO_SAME_TEAM);
    expect(biases.getBias("A", "B")).toEqual(BiasKind.NO_BIAS);
    expect(biases.getBias("A", "C")).toEqual(BiasKind.NO_BIAS);

    expect(biases.getBias("B", "A")).toEqual(BiasKind.NO_BIAS);
    expect(biases.getBias("B", "B")).toEqual(BiasKind.NEXT_TO_SAME_TEAM);
    expect(biases.getBias("B", "C")).toEqual(BiasKind.NO_BIAS);

    expect(biases.getBias("C", "A")).toEqual(BiasKind.NO_BIAS);
    expect(biases.getBias("C", "B")).toEqual(BiasKind.NO_BIAS);
    expect(biases.getBias("C", "C")).toEqual(BiasKind.NEXT_TO_SAME_TEAM);
  });
});

describe("team member editing", () => {
  test("can add team member", () => {
    const before = Store.create(getSnapshot(store));
    store.addTeamMember("B");
    expect(store.teams.list.length).toEqual(before.teams.list.length);
    expect(store.teams.list[0]).toEqual(before.teams.list[0]);
    const expected = teamFor("B", 4, 4);
    expect(store.teams.list[1]).toEqual(expected);
  });

  test("indicates cannot add team member when at limit", () => {
    expect(store.teams.list[1].canAdd).toEqual(true);
    store.addTeamMember("B");
    expect(store.teams.list[1].canAdd).toEqual(false);
  });

  test("cannot add team member when at limit", () => {
    store.addTeamMember("B");
    expect(() => {
      store.addTeamMember("B");
    }).toThrowError(/^cannot add team member$/);
  });
});
