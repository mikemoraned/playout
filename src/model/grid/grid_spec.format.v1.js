import { positionFor } from "./grid";
import { InvalidProblemSpec } from "../invalid_problem_spec";
import { GridSpec } from "./grid_spec";
import { parseGridDimensions, toSeatString } from "./grid_spec.format";

export function toV1Format(gridSpec) {
  return `${gridSpec.width}x${gridSpec.height}${toSeatString(
    gridSpec.seats,
    gridSpec.width,
    gridSpec.height,
    ".",
    "~"
  )}_v1`;
}

export const V1_REGEX = /(\d+)x(\d+)([.~]+)_v1/;

export function parseV1GridSpec(match) {
  const { width, height } = parseGridDimensions(match);
  const seats = parseV1SeatsSpec(width, height, match[3]);
  return GridSpec.create({
    width,
    height,
    seats,
  });
}

export function parseV1SeatsSpec(width, height, seatString) {
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
  return seats;
}
