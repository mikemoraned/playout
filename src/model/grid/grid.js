import { types, getSnapshot } from "mobx-state-tree";
import { Occupancy } from "./occupancy";
import { GridSpec } from "./grid_spec";

export const Grid = types
  .model("Grid", {
    width: types.number,
    height: types.number,
    seats: types.array(types.string),
    decorations: types.array(types.string),
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
        if (self.hasDecoration(position)) {
          self.decorations = self.decorations.filter((s) => s !== position);
        }
      }
    },
    clearSeats() {
      self.seats = [];
    },
    clearDecorations() {
      self.decorations = [];
    },
    addDecoration(position) {
      self.decorations.push(position);
    },
    randomlyAddSeats(minimumSeats) {
      function nieghbours(x, y) {
        return [
          positionFor(x - 1, y),
          positionFor(x, y - 1),
          positionFor(x + 1, y),
          positionFor(x, y + 1),
        ];
      }

      function freedomsOfPosition(x, y) {
        return nieghbours(x, y).filter((p) => !self.hasSeat(p));
      }

      function hasSomeFreedomsInPosition(x, y) {
        return freedomsOfPosition(x, y).length > 0;
      }

      function claimsLastFreedomOfNieghbour(x, y) {
        const thisPosition = positionFor(x, y);
        return nieghbours(x, y).some((p) => {
          const [nx, ny] = coordsFromPosition(p);
          const freedoms = freedomsOfPosition(nx, ny);
          return freedoms.length === 1 && freedoms.indexOf(thisPosition) !== -1;
        });
      }

      while (self.totalSeats < minimumSeats) {
        for (let x = 0; x < self.width; x++) {
          for (let y = 0; y < self.height; y++) {
            if (Math.random() < 0.5) {
              const position = positionFor(x, y);
              if (
                !self.hasSeat(position) &&
                hasSomeFreedomsInPosition(x, y) &&
                !claimsLastFreedomOfNieghbour(x, y)
              ) {
                self.addSeat(position);
              }
            }
          }
        }
      }

      self.clearDecorations();
      for (let x = 0; x < self.width; x++) {
        for (let y = 0; y < self.height; y++) {
          const position = positionFor(x, y);
          if (
            !self.hasSeat(position) &&
            freedomsOfPosition(x, y).length >= 3 &&
            Math.random() < 0.5
          ) {
            self.addDecoration(position);
          }
        }
      }
    },
  }))
  .views((self) => ({
    hasSeat(position) {
      return self.seats.indexOf(position) !== -1;
    },
    hasDecoration(position) {
      return self.decorations.indexOf(position) !== -1;
    },
    findOccupancy(position) {
      return self.occupied.find((o) => o.position === position);
    },
    get totalSeats() {
      return self.seats.length;
    },
    toGridSpec() {
      return GridSpec.create({
        width: self.width,
        height: self.height,
        seats: getSnapshot(self.seats),
      });
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

export function coordsFromPosition(position) {
  const [xString, yString] = position.split("_");
  return [parseInt(xString), parseInt(yString)];
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
