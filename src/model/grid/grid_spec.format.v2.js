import { InvalidProblemSpec } from "../invalid_problem_spec";
import { GridSpec } from "./grid_spec";
import { parseGridDimensions, toSeatString } from "./grid_spec.format";
import { parseV1SeatsSpec } from "./grid_spec.format.v1";

export function toV2Format(gridSpec) {
  let binarySeatString = toSeatString(
    gridSpec.seats,
    gridSpec.width,
    gridSpec.height,
    "0",
    "1"
  );
  if (binarySeatString.length % 8 !== 0) {
    const numNeeded = 8 - (binarySeatString.length % 8);
    binarySeatString += "0".repeat(numNeeded);
  }
  let charCodes = [];
  for (let offset = 0; offset < binarySeatString.length; offset += 8) {
    charCodes.push(parseInt(binarySeatString.slice(offset, offset + 8), 2));
  }
  const bytesString = String.fromCharCode(...charCodes);
  const base64 = btoa(bytesString);
  const urlSafe = mapBase64ToUrlSafeChars(base64);
  return `${gridSpec.width}x${gridSpec.height}_${urlSafe}v2`;
}

export const V2_REGEX = /(\d+)x(\d+)_([0-9A-Za-z._]+-{0,2})v2/;

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

export function parseV2GridSpec(match) {
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
  const seats = parseV1SeatsSpec(width, height, seatString);

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
