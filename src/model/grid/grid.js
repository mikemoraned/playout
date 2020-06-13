import { types } from "mobx-state-tree";
import { Occupancy } from "./occupancy";

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
    toggleSeat(position) {
      if (self.hasSeat(position)) {
        self.seats = self.seats.filter((s) => s !== position);
      } else {
        self.seats.push(position);
      }
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

export function expandToNextToArea(position, dimensions) {
  const { width, height } = dimensions;
  const match = /(\d+)_(\d+)/.exec(position);
  const x = parseInt(match[1]);
  const y = parseInt(match[2]);
  const areaPositions = [];
  for (let xArea = x - 1; xArea <= x + 1; xArea++) {
    for (let yArea = y - 1; yArea <= y + 1; yArea++) {
      if (0 <= xArea && xArea < width && 0 <= yArea && yArea < height) {
        const areaPosition = positionFor(xArea, yArea);
        if (areaPosition !== position) {
          areaPositions.push(areaPosition);
        }
      }
    }
  }
  return areaPositions;
}
