import { types } from "mobx-state-tree";

export const BiasAssignmentSpec = types.model("BiasSpec", {
  from_name: types.string,
  to_name: types.string,
  bias_kind: types.string,
});
