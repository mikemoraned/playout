import { testStore } from "./testStore";

let store = null;

beforeEach(() => {
  store = testStore();
});

describe("team selection", () => {
  test("default selected team is first team", () => {
    expect(store.teams.next).toBe("A");
  });

  //     test("can select team by name", () => {
  //       const stateAfter = reducer(state, selectTeamAction("B"));
  //       expect(stateAfter.teams.next).toBe("B");
  //     });

  //     test("select unknown team throws Error", () => {
  //       expect(() => {
  //         reducer(state, selectTeamAction("C"));
  //       }).toThrowError(/^unknown team: C$/);
  //     });
});
