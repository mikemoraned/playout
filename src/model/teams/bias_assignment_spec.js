import { types } from "mobx-state-tree";

export const BiasAssignmentSpec = types.model("BiasSpec", {
  from_name: types.string,
  to_name: types.string,
  bias_kind: types.string,
});

export function biasSpecFrom(from_name, to_name, bias_kind) {
  return BiasAssignmentSpec.create({
    from_name,
    to_name,
    bias_kind,
  });
}
