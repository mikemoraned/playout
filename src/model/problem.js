import { types } from "mobx-state-tree";
import { storeFor } from "./store";
import makeInspectable from "mobx-devtools-mst";
import { gridFor } from "./grid/grid";
import { teamsFor } from "./teams/teams";
import { templateFor } from "./teams/template";
import { teamFor } from "./teams/team";
import { positionFor } from "./grid/grid";
import { parseGridSpec } from "./grid/grid_spec.format";
import { GridSpec } from "./grid/grid_spec";

export const Problem = types
  .model("Problem", {
    grid: GridSpec,
  })
  .views((self) => ({
    toStore() {
      console.log("creating mst initial state");
      const store = storeFor(
        defaultTeams(),
        gridFor(self.grid.width, self.grid.height)
      );

      self.grid.seats.forEach((position) => {
        store.grid.addSeat(position);
      });

      makeInspectable(store);
      return store;
    },
  }));

export class InvalidProblemSpec extends Error {}

export function parseProblemFrom(gridSpec) {
  if (gridSpec === null || gridSpec === undefined) {
    throw new InvalidProblemSpec("missing spec");
  } else {
    return Problem.create({ grid: parseGridSpec(gridSpec) });
  }
}

function defaultTeams() {
  const defaultSize = 5;
  const maximumSize = 10;
  return teamsFor(
    [
      teamFor("A", 3, maximumSize),
      teamFor("B", 2, maximumSize),
      teamFor("C", 4, maximumSize),
    ],
    templateFor(["A", "B", "C", "D", "E"], defaultSize, maximumSize)
  );
}

export function randomEasyGridSpec() {
  return randomGridSpec(10, 10);
}

export function randomHardGridSpec() {
  return randomGridSpec(5, 5);
}

export function randomGridSpec(width, height) {
  const minimumSeats = defaultTeams().totalMembers;
  const seats = [];
  while (seats.length < minimumSeats) {
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        if (Math.random() < 0.5) {
          const position = positionFor(x, y);
          seats.push(position);
        }
      }
    }
  }
  return GridSpec.create({
    width,
    height,
    seats,
  });
}
