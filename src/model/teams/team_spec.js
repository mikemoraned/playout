import { types } from "mobx-state-tree";

export const TeamSpec = types.model("TeamSpec", {
  name: types.string,
  size: types.number,
});
