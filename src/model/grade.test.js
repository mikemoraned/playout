import { Problem } from "./problem";
import { GridSpec } from "./grid/grid_spec";
import { TeamsSpec } from "./teams/teams_spec";
import { TeamSpec } from "./teams/team_spec";
import { BiasAssignmentSpec } from "./teams/bias_assignment_spec";
import { BiasKind } from "./teams/bias";
import {
  gradeFromProblemSpec,
  gradeFromName,
  randomEasyProblemSpec,
  randomMediumKind1ProblemSpec,
  randomMediumKind2ProblemSpec,
  randomHardProblemSpec,
} from "./grade";

const easyGrade = gradeFromName("Easy");
const mediumGrade = gradeFromName("Medium");
const hardGrade = gradeFromName("Hard");

let teams = null;
beforeEach(() => {
  teams = [
    TeamSpec.create({ name: "A", size: 2 }),
    TeamSpec.create({ name: "B", size: 3 }),
    TeamSpec.create({ name: "C", size: 1 }),
  ];
});

describe("grading a ProblemSpec", () => {
  test("easy: a 10x10 map with no additional biases", () => {
    const problem = Problem.create({
      grid: GridSpec.create({
        width: 10,
        height: 10,
        seats: [],
      }),
      teams: TeamsSpec.create({
        teams,
        biases: [],
      }),
    });

    expect(gradeFromProblemSpec(problem)).toEqual(easyGrade);
  });

  test("medium: a 10x10 map with any additional biases", () => {
    const problem = Problem.create({
      grid: GridSpec.create({
        width: 10,
        height: 10,
        seats: [],
      }),
      teams: TeamsSpec.create({
        teams,
        biases: [
          BiasAssignmentSpec.create({
            from_name: "A",
            to_name: "B",
            bias_kind: BiasKind.NEXT_TO,
          }),
        ],
      }),
    });

    expect(gradeFromProblemSpec(problem)).toEqual(mediumGrade);
  });

  test("medium: a 5x5 map with no additional biases", () => {
    const problem = Problem.create({
      grid: GridSpec.create({
        width: 5,
        height: 5,
        seats: [],
      }),
      teams: TeamsSpec.create({
        teams,
        biases: [],
      }),
    });

    expect(gradeFromProblemSpec(problem)).toEqual(mediumGrade);
  });

  test("hard: a 5x5 map with any additional biases", () => {
    const problem = Problem.create({
      grid: GridSpec.create({
        width: 5,
        height: 5,
        seats: [],
      }),
      teams: TeamsSpec.create({
        teams,
        biases: [
          BiasAssignmentSpec.create({
            from_name: "A",
            to_name: "B",
            bias_kind: BiasKind.NEXT_TO,
          }),
        ],
      }),
    });

    expect(gradeFromProblemSpec(problem)).toEqual(hardGrade);
  });
});

describe("generated ProblemSpecs have consistent Grade", () => {
  test("easy", () => {
    const problem = easyGrade.randomProblemSpec();

    expect(gradeFromProblemSpec(problem)).toEqual(easyGrade);
  });

  test("medium", () => {
    const problem = mediumGrade.randomProblemSpec();

    expect(gradeFromProblemSpec(problem)).toEqual(mediumGrade);
  });

  test("hard", () => {
    const problem = hardGrade.randomProblemSpec();

    expect(gradeFromProblemSpec(problem)).toEqual(hardGrade);
  });
});

describe("underlying functions produce consistent Grade", () => {
  test("easy", () => {
    const problem = randomEasyProblemSpec();

    expect(gradeFromProblemSpec(problem)).toEqual(easyGrade);
  });

  test("medium, kind 1", () => {
    const problem = randomMediumKind1ProblemSpec();

    expect(gradeFromProblemSpec(problem)).toEqual(mediumGrade);
  });

  test("medium, kind 2", () => {
    const problem = randomMediumKind2ProblemSpec();

    expect(gradeFromProblemSpec(problem)).toEqual(mediumGrade);
  });

  test("hard", () => {
    const problem = randomHardProblemSpec();

    expect(gradeFromProblemSpec(problem)).toEqual(hardGrade);
  });
});
