import { types } from "mobx-state-tree";
import { storeFor } from "./store";
import makeInspectable from "mobx-devtools-mst";
import { gridFor } from "./grid";
import { teamFor, teamsFor, templateFor } from "./team";
import { positionFor } from "./grid";

export const GridSpec = types
  .model("GridSpec", {
    width: types.integer,
    height: types.integer,
    seats: types.array(types.string),
  })
  .views((self) => ({
    toVersion1Format() {
      let spaceString = "";
      for (let y = 0; y < self.height; y++) {
        for (let x = 0; x < self.width; x++) {
          const position = positionFor(x, y);
          if (self.seats.indexOf(position) === -1) {
            spaceString += ".";
          } else {
            spaceString += "~";
          }
        }
      }
      return `${self.width}x${self.height}${spaceString}_v1`;
    },
  }));

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

function parseGridSpec(gridSpec) {
  const regex = /(\d+)x(\d+)([.~]+)_v1/;
  const match = gridSpec.match(regex);
  if (match === null) {
    throw new InvalidProblemSpec("invalid spec: incorrect format");
  }
  const width = parseInt(match[1]);
  const height = parseInt(match[2]);
  if (width === 0 || height === 0) {
    throw new InvalidProblemSpec("invalid spec: dimensions cannot be zero");
  }
  const maxArea = 10000;
  if (width * height > maxArea) {
    throw new InvalidProblemSpec(
      `invalid spec: width * height too large, must be <= ${maxArea}`
    );
  }
  const seatString = match[3];
  const expectedSpaceCharacters = width * height;
  if (seatString.length !== expectedSpaceCharacters) {
    throw new InvalidProblemSpec(
      `invalid spec: expected ${expectedSpaceCharacters} seat indicators`
    );
  }
  const seats = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = y * width + x;
      if (seatString.charAt(index) === "~") {
        seats.push(positionFor(x, y));
      }
    }
  }
  return GridSpec.create({
    width,
    height,
    seats,
  });
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

function randomGridSpec(width, height) {
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
