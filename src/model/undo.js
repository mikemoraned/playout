import { types } from "mobx-state-tree";

export const UndoToggleMemberPlacement = types
  .model("UndoToggleMemberPlacement", {
    position: types.string,
  })
  .actions((self) => ({
    apply(store) {
      store.toggleMemberPlacementWithoutUndo(self.position);
    },
  }));
