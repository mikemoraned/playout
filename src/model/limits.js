import { InvalidProblemSpec } from "./invalid_problem_spec";

export function validateArea(width, height) {
  const maxArea = 10000;
  if (width * height > maxArea) {
    throw new InvalidProblemSpec(
      `invalid spec: width * height too large, must be <= ${maxArea}`
    );
  }
}
