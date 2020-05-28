import { positionFor } from "./grid";
import { testStore } from "./testStore";
import { Store } from "./store";
import { UndoToggleMemberPlacement } from "./undo";
import { getSnapshot } from "mobx-state-tree";

let store = {};

beforeEach(() => {
  store = testStore();
});

describe("undo", () => {
  test("undo toggle", () => {
    const before = Store.create(getSnapshot(store));
    expect(before.grid.occupied).toEqual([]);
    expect(before.undos).toEqual([]);

    store.toggleMemberPlacement(positionFor(0, 0));

    expect(store.undos).toEqual([
      UndoToggleMemberPlacement.create({ position: positionFor(0, 0) }),
    ]);

    store.undo();
    expect(store.teams).toEqual(before.teams);
    expect(store.grid).toEqual(before.grid);
    expect(store.undos).toEqual([]);
  });
});
