import { BiasKind } from "./teams/bias";
import { testStore } from "./testStore";
import { positionFor } from "./grid/grid";

let store = {};

beforeEach(() => {
  store = testStore();
});

describe("bias evaluation", () => {
  describe("with all default NEXT_TO biases", () => {
    test("no-one placed, score is zero", () => {
      expect(store.evaluation.scoring.score).toEqual(0);
      store.teams.list.forEach((t) => {
        const teamScore = store.evaluation.scoring.teams[t.name];
        expect(teamScore.score).toEqual(0);
      });
    });

    test("a single team member placed counts towards the score", () => {
      store.selectTeam("A");
      store.toggleMemberPlacement(positionFor(0, 0));

      const teamANumBiasesPerMember = 1;
      const teamASize = 2;
      const teamABiasesChecked = teamASize * teamANumBiasesPerMember;
      const teamAMembersBiasedSatisfied = 1 * teamANumBiasesPerMember;
      const teamAScore = Math.floor(
        (1000 * teamAMembersBiasedSatisfied) / teamABiasesChecked
      );

      expect(store.evaluation.scoring.teams["A"].score).toEqual(teamAScore);

      const teamBNumBiasesPerMember = 1;
      const teamBSize = 3;
      const teamBBiasesChecked = teamBSize * teamBNumBiasesPerMember;
      const teamBMembersBiasedSatisfied = 0 * teamBNumBiasesPerMember;
      const teamBScore = Math.floor(
        (1000 * teamBMembersBiasedSatisfied) / teamBBiasesChecked
      );
      expect(store.evaluation.scoring.teams["B"].score).toEqual(teamBScore);
    });
  });

  describe("with NEXT_TO biases", () => {
    beforeEach(() => {
      store.rotateBias("A", "B");
    });

    const teamANumBiasesPerMember = 2;
    const teamASize = 2;
    const teamABiasesChecked = teamASize * teamANumBiasesPerMember;

    const teamBNumBiasesPerMember = 2;
    const teamBSize = 3;
    const teamBBiasesChecked = teamBSize * teamBNumBiasesPerMember;

    test("assumptions", () => {
      expect(store.teams.biases.getBias("A", "B")).toEqual(BiasKind.NEXT_TO);
      expect(store.teams.biases.getBias("B", "A")).toEqual(BiasKind.NEXT_TO);
    });

    test("NEXT_TO bias counts towards score for placed team members next to the other team", () => {
      store.selectTeam("A");
      store.toggleMemberPlacement(positionFor(0, 0));
      store.selectTeam("B");
      store.toggleMemberPlacement(positionFor(1, 1));

      const teamAMembersBiasedSatisfied = 1 * teamANumBiasesPerMember;
      const teamAScore = Math.floor(
        (1000 * teamAMembersBiasedSatisfied) / teamABiasesChecked
      );

      expect(store.evaluation.scoring.teams["A"].score).toEqual(teamAScore);

      const teamBMembersBiasedSatisfied = 1 * teamBNumBiasesPerMember;
      const teamBScore = Math.floor(
        (1000 * teamBMembersBiasedSatisfied) / teamBBiasesChecked
      );
      expect(store.evaluation.scoring.teams["B"].score).toEqual(teamBScore);
    });

    test("NEXT_TO bias does not count towards score if a team member is not next to the other team", () => {
      store.selectTeam("A");
      store.toggleMemberPlacement(positionFor(0, 0));

      const teamAMembersBiasedSatisfied = 1 * 0 + 1 * 1;
      const teamAScore = Math.floor(
        (1000 * teamAMembersBiasedSatisfied) / teamABiasesChecked
      );

      expect(store.evaluation.scoring.teams["A"].score).toEqual(teamAScore);

      const teamBMembersBiasedSatisfied = 1 * 0 + 1 * 0;
      const teamBScore = Math.floor(
        (1000 * teamBMembersBiasedSatisfied) / teamBBiasesChecked
      );
      expect(store.evaluation.scoring.teams["B"].score).toEqual(teamBScore);
    });
  });
});
