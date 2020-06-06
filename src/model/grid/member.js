import { types } from "mobx-state-tree";

export const Member = types.model("Member", {
  id: types.identifier,
  team: types.string,
  index: types.number,
});

export function memberFor(teamName, index) {
  return Member.create({
    id: `${teamName}_${index}`,
    team: teamName,
    index,
  });
}
