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
  .views((self) => {
    function toSeatString(missingChar, presentChar) {
      let seatString = "";
      for (let y = 0; y < self.height; y++) {
        for (let x = 0; x < self.width; x++) {
          const position = positionFor(x, y);
          if (self.seats.indexOf(position) === -1) {
            seatString += missingChar;
          } else {
            seatString += presentChar;
          }
        }
      }
      return seatString;
    }

    return {
      toVersion1Format() {
        return `${self.width}x${self.height}${toSeatString(".", "~")}_v1`;
      },
      toVersion2Format() {
        let binarySeatString = toSeatString("0", "1");
        if (binarySeatString.length % 8 !== 0) {
          const numNeeded = 8 - (binarySeatString.length % 8);
          binarySeatString += "0".repeat(numNeeded);
        }
        let charCodes = [];
        for (let offset = 0; offset < binarySeatString.length; offset += 8) {
          charCodes.push(
            parseInt(binarySeatString.slice(offset, offset + 8), 2)
          );
        }
        const bytesString = String.fromCharCode(...charCodes);
        const base64 = btoa(bytesString);
        const urlSafe = mapBase64ToUrlSafeChars(base64);
        return `${self.width}x${self.height}_${urlSafe}v2`;
      },
    };
  });

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

function mapBase64ToUrlSafeChars(base64) {
  return remap("+/=", "._-", base64);
}

function mapUrlSafeCharsToBase64(urlSafe) {
  return remap("._-", "+/=", urlSafe);
}

function remap(from, to, s) {
  if (from.length !== to.length) {
    throw new Error(`${from} and ${to} must have same length`);
  }
  const map = new Map();
  for (let index = 0; index < from.length; index++) {
    map.set(from.charAt(index), to.charAt(index));
  }
  const regex = new RegExp(`[${from}]`, "g");
  return s.replace(regex, (f) => (map.has(f) ? map.get(f) : f));
}

export function parseProblemFrom(gridSpec) {
  if (gridSpec === null || gridSpec === undefined) {
    throw new InvalidProblemSpec("missing spec");
  } else {
    return Problem.create({ grid: parseGridSpec(gridSpec) });
  }
}

function parseGridSpec(gridSpec) {
  const v1Regex = /(\d+)x(\d+)([.~]+)_v1/;
  const v1Match = gridSpec.match(v1Regex);
  const v2Regex = /(\d+)x(\d+)_([0-9A-Za-z._]+-{0,2})v2/;
  const v2Match = gridSpec.match(v2Regex);
  if (v1Match === null && v2Match === null) {
    throw new InvalidProblemSpec("invalid spec: incorrect format");
  }
  if (v1Match !== null) {
    return parseV1GridSpec(v1Match);
  } else {
    return parseV2GridSpec(v2Match);
  }
}

function parseGridDimensions(match) {
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
  return { width, height };
}

function parseV1GridSpec(match) {
  const { width, height } = parseGridDimensions(match);
  const seats = parseSeatsSpec(width, height, match[3]);
  return GridSpec.create({
    width,
    height,
    seats,
  });
}

function parseSeatsSpec(width, height, seatString) {
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

function parseV2GridSpec(match) {
  const { width, height } = parseGridDimensions(match);
  const urlSafeBase64String = match[3];
  const base64String = mapUrlSafeCharsToBase64(urlSafeBase64String);
  const bytesString = parseBase64(base64String);
  let binarySeatString = "";
  for (let index = 0; index < bytesString.length; index++) {
    binarySeatString += bytesString
      .charCodeAt(index)
      .toString(2)
      .padStart(8, "0");
  }
  const seatString = remap("01", ".~", binarySeatString).slice(
    0,
    width * height
  );
  const seats = parseSeatsSpec(width, height, seatString);

  return GridSpec.create({
    width,
    height,
    seats,
  });
}

function parseBase64(base64) {
  try {
    return atob(base64);
  } catch (e) {
    throw new InvalidProblemSpec(`invalid spec: cannot decode from base64`);
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
