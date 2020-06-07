import { types } from "mobx-state-tree";
import { Member } from "./member";

export const Occupancy = types.model("Occupancy", {
  position: types.string,
  member: Member,
});

export function occupancyFor(position, member) {
  return Occupancy.create({ position, member });
}
