import { validateArea } from "../limits";
import { InvalidProblemSpec } from "../invalid_problem_spec";
import { AreaSpec } from "./area_spec";

export const AREA_REGEX = /(\d+)x(\d+)/;

export function parseAreaSpec(areaSpec) {
  if (areaSpec === null || areaSpec === undefined) {
    throw new InvalidProblemSpec("missing spec");
  }
  const match = areaSpec.match(AREA_REGEX);
  if (match === null) {
    throw new InvalidProblemSpec("invalid spec: incorrect format");
  }

  const { width, height } = parseGridDimensions(match);
  return AreaSpec.create({ width, height });
}

export function parseGridDimensions(match) {
  const width = parseInt(match[1]);
  const height = parseInt(match[2]);
  if (width === 0 || height === 0) {
    throw new InvalidProblemSpec("invalid spec: dimensions cannot be zero");
  }
  validateArea(width, height);
  return { width, height };
}
