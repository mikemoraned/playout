import { types } from "mobx-state-tree";

export const BiasAssignmentSpec = types.model("BiasSpec", {
  from_name: types.string,
  to_name: types.string,
  bias_kind: types.string,
});

export const TeamSpec = types.model("TeamSpec", {
  name: types.string,
  size: types.number,
});

export const TeamsSpec = types.model("TeamsSpec", {
  teams: types.array(TeamSpec),
  biases: types.array(BiasAssignmentSpec),
});
