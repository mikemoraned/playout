import { positionFor } from "./grid";
import { InvalidProblemSpec } from "../invalid_problem_spec";
import { parseV1GridSpec, V1_REGEX } from "./grid_spec.format.v1";
import { parseV2GridSpec, V2_REGEX } from "./grid_spec.format.v2";

export function parseGridSpec(gridSpec) {
  if (gridSpec === null || gridSpec === undefined) {
    throw new InvalidProblemSpec("missing spec");
  }
  const v1Match = gridSpec.match(V1_REGEX);
  const v2Match = gridSpec.match(V2_REGEX);
  if (v1Match === null && v2Match === null) {
    throw new InvalidProblemSpec("invalid spec: incorrect format");
  }
  if (v1Match !== null) {
    return parseV1GridSpec(v1Match);
  } else {
    return parseV2GridSpec(v2Match);
  }
}

export function toSeatString(seats, width, height, missingChar, presentChar) {
  let seatString = "";
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const position = positionFor(x, y);
      if (seats.indexOf(position) === -1) {
        seatString += missingChar;
      } else {
        seatString += presentChar;
      }
    }
  }
  return seatString;
}
