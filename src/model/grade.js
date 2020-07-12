import { types } from "mobx-state-tree";
import { randomProblemWithGridSize } from "./problem";

export const Grade = types
  .model("Grade", {
    name: types.enumeration("GradeName", ["Easy", "Medium", "Hard"]),
  })
  .views((self) => ({
    randomProblemSpec() {
      if (self.name === "Easy") {
        return randomEasyProblemSpec();
      } else if (self.name === "Medium") {
        if (Math.random() < 0.5) {
          return randomMediumKind1ProblemSpec();
        } else {
          return randomMediumKind2ProblemSpec();
        }
      } else {
        return randomHardProblemSpec();
      }
    },
  }));

export function randomEasyProblemSpec() {
  return randomProblemWithGridSize(10, 10);
}
export function randomMediumKind1ProblemSpec() {
  const problem = randomProblemWithGridSize(10, 10);
  problem.teams.randomiseBiases();
  return problem;
}

export function randomMediumKind2ProblemSpec() {
  return randomProblemWithGridSize(5, 5);
}

export function randomHardProblemSpec() {
  const problem = randomProblemWithGridSize(5, 5);
  problem.teams.randomiseBiases();
  return problem;
}

export function gradeFromProblemSpec(problemSpec) {
  const { width, height } = problemSpec.grid;
  const anyExtraBiases = problemSpec.teams.biases.length > 0;
  if (width === 10 && height === 10) {
    if (anyExtraBiases) {
      return gradeFromName("Medium");
    } else {
      return gradeFromName("Easy");
    }
  } else if (width === 5 && height === 5) {
    if (anyExtraBiases) {
      return gradeFromName("Hard");
    } else {
      return gradeFromName("Medium");
    }
  } else {
    return gradeFromName("Medium");
  }
}

export function gradeFromName(name) {
  return Grade.create({
    name,
  });
}
