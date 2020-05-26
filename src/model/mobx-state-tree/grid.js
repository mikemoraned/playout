import { types } from "mobx-state-tree";
import { Member } from "./team";

export const Occupancy = types.model("Occupancy", {
  position: types.string,
  member: Member,
});

export function occupancyFor(position, member) {
  return Occupancy.create({ position, member });
}

export const Grid = types
  .model("Grid", {
    width: types.number,
    height: types.number,
    seats: types.array(types.string),
    occupied: types.array(Occupancy),
  })
  .actions((self) => ({
    addOccupancy(occupancy) {
      self.occupied.push(occupancy);
    },
    removeOccupancy(occupancy) {
      self.occupied = self.occupied.filter(
        (o) => o.member.id !== occupancy.member.id
      );
    },
    addSeat(position) {
      self.seats.push(position);
    },
  }))
  .views((self) => ({
    hasSeat(position) {
      return self.seats.indexOf(position) !== -1;
    },
    findOccupancy(position) {
      return self.occupied.find((o) => o.position === position);
    },
  }));

export function gridFor(width, height) {
  return {
    width,
    height,
    seats: [],
    occupied: [],
  };
}

export function positionFor(x, y) {
  return `${x}_${y}`;
}
