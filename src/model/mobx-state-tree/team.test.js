import { testStore } from "./testStore";

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
