import { types } from "mobx-state-tree";
import { memberFor } from "../grid/member";

export const Team = types
  .model("Team", {
    id: types.identifier,
    name: types.string,
    nextIndex: types.number,
    placed: types.array(types.boolean),
    maximumSize: types.number,
  })
  .actions((self) => ({
    addTeamMember() {
      if (!self.canAdd) {
        throw new Error("cannot add team member");
      }
      self.placed.push(false);
    },
    placeMember() {
      const member = memberFor(self.name, self.nextIndex);
      self.placed[self.nextIndex] = true;
      self.nextIndex = self.placed.findIndex((taken) => !taken);
      return member;
    },
    returnMember(member) {
      self.placed[member.index] = false;
      self.nextIndex = self.placed.findIndex((taken) => !taken);
    },
  }))
  .views((self) => ({
    get canAdd() {
      return self.size < self.maximumSize;
    },
    get size() {
      return self.placed.length;
    },
    get remaining() {
      const totalOccupied = self.placed.reduce(
        (accum, occupied) => (occupied ? accum + 1 : accum),
        0
      );
      return self.placed.length - totalOccupied;
    },
    get next() {
      return self.nextIndex;
    },
  }));

export function teamFor(name, size, maximumSize) {
  const placed = Array(size).fill(false);
  return Team.create({ id: name, name, nextIndex: 0, placed, maximumSize });
}
