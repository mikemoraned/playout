import { testStore } from "./testStore";
import { gridFor, positionFor } from "./grid";
import { memberFor } from "./team";
import { getSnapshot } from "mobx-state-tree";
import { Store } from "./store";

let store = null;

beforeEach(() => {
  store = testStore();
});

describe("team member placement", () => {
  test("no seat is occupied by default", () => {
    expect(store.grid.occupied).toEqual([]);
  });

  test("toggle place member on unoccupied seat", () => {
    expect(store.grid.occupied).toEqual([]);
    store.toggleMemberPlacement(positionFor(0, 0));

    expect(store.teams.list[0].name).toEqual("A");
    expect(store.teams.list[0].canAdd).toEqual(true);
    expect(store.teams.list[0].placed).toEqual([true, false]);
    expect(store.teams.list[0].next).toEqual(1);
    expect(store.teams.list[0].remaining).toEqual(1);

    expect(store.teams.list[1].name).toEqual("B");
    expect(store.teams.list[1].canAdd).toEqual(true);
    expect(store.teams.list[1].placed).toEqual([false, false, false]);
    expect(store.teams.list[1].next).toEqual(0);
    expect(store.teams.list[1].remaining).toEqual(3);

    expect(store.grid.occupied).toEqual([
      {
        member: memberFor("A", 0),
        position: positionFor(0, 0),
      },
    ]);
  });

  test("toggle place member on occupied seat", () => {
    const before = Store.create(getSnapshot(store));

    store.toggleMemberPlacement(positionFor(0, 0));
    expect(store.teams).not.toEqual(before.teams);
    expect(store.grid).not.toEqual(before.grid);

    store.toggleMemberPlacement(positionFor(0, 0));
    expect(store.teams).toEqual(before.teams);
    expect(store.grid).toEqual(before.grid);
  });

  // test("toggle place member on position with no seat", () => {
  //   expect(state.grid.occupied).toEqual([]);
  //   const stateAfterToggle = reducer(
  //     state,
  //     togglePlaceMemberAction(positionFor(0, 1))
  //   );
  //   expect(stateAfterToggle.teams).toEqual(state.teams);
  //   expect(stateAfterToggle.grid).toEqual(state.grid);
  // });
});
