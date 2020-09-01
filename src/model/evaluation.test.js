import { BiasKind } from "./teams/bias";
import { biasSpecFrom } from "./teams/bias_assignment_spec";
import { positionFor, positionCompare } from "./grid/grid";
import { storeFor } from "./store";
import { teamsFor } from "./teams/teams";
import { teamFor } from "./teams/team";
import { templateFor } from "./teams/template";
import { gridFor } from "./grid/grid";
import { availableProvisions, provided } from "./explainable_evaluation";
import { parseProblemFrom } from "./problem";
import { TeamSpec } from "./teams/team_spec";

describe("bias evaluation", () => {
  const O = "O";
  const X = "X";
  const A = "A";
  const B = "B";
  const C = "C";

  const _ = [];

  const defaultSize = 3;
  const maximumSize = 4;

  describe("with all default NEXT_TO biases", () => {
    test("no-one placed, score is zero", () => {
      const store = fromPicture(
        teamsFor(
          [teamFor(A, 2, maximumSize), teamFor(B, 3, maximumSize)],
          templateFor([A, B, C], defaultSize, maximumSize)
        ),
        [],
        // prettier-ignore
        [
          [X, O],
          [O, X],
        ]
      );

      const availableProvisionsForA = providersFromPicture(
        // prettier-ignore
        [
          [_, _],
          [_, _],
        ]
      );
      const providedForA = providersFromPicture(
        // prettier-ignore
        [
          [_, _],
          [_, _],
        ]
      );
      const availableProvisionsForB = providersFromPicture(
        // prettier-ignore
        [
          [_, _],
          [_, _],
        ]
      );
      const providedForB = providersFromPicture(
        // prettier-ignore
        [
          [_, _],
          [_, _],
        ]
      );

      expect(store.evaluation.scoring.score).toEqual(0);
      store.teams.list.forEach((t) => {
        const teamScore = store.evaluation.scoring.teams[t.name];
        expect(teamScore.score).toEqual(0);
      });

      expect(availableProvisions(store, A, BiasKind.NEXT_TO_SAME_TEAM)).toEqual(
        availableProvisionsForA
      );
      expect(provided(store, A, BiasKind.NEXT_TO_SAME_TEAM)).toEqual(
        providedForA
      );
      expect(availableProvisions(store, B, BiasKind.NEXT_TO_SAME_TEAM)).toEqual(
        availableProvisionsForB
      );
      expect(provided(store, B, BiasKind.NEXT_TO_SAME_TEAM)).toEqual(
        providedForB
      );
    });

    test("a single team member placed *does not* count towards the score", () => {
      const store = fromPicture(
        teamsFor(
          [teamFor(A, 2, maximumSize), teamFor(B, 3, maximumSize)],
          templateFor([A, B, C], defaultSize, maximumSize)
        ),
        [],
        // prettier-ignore
        [
          [A, O],
          [O, X],
        ]
      );

      const availableProvisionsForA = providersFromPicture(
        // prettier-ignore
        [
          [_,   _],
          [_, [A]],
        ]
      );
      const providedForA = providersFromPicture(
        // prettier-ignore
        [
          [_, _],
          [_, _],
        ]
      );
      const availableProvisionsForB = providersFromPicture(
        // prettier-ignore
        [
          [_,  _],
          [_,  _],
        ]
      );
      const providedForB = providersFromPicture(
        // prettier-ignore
        [
          [_,  _],
          [_,  _],
        ]
      );

      const teamANumBiasesPerMember = 1;
      const teamASize = 2;
      const teamABiasesChecked = teamASize * teamANumBiasesPerMember;
      const teamAMembersBiasedSatisfied = 0 * teamANumBiasesPerMember;
      const teamAScore = Math.floor(
        (1000 * teamAMembersBiasedSatisfied) / teamABiasesChecked
      );

      expect(store.evaluation.scoring.teams[A].score).toEqual(teamAScore);

      const teamBNumBiasesPerMember = 1;
      const teamBSize = 3;
      const teamBBiasesChecked = teamBSize * teamBNumBiasesPerMember;
      const teamBMembersBiasedSatisfied = 0 * teamBNumBiasesPerMember;
      const teamBScore = Math.floor(
        (1000 * teamBMembersBiasedSatisfied) / teamBBiasesChecked
      );
      expect(store.evaluation.scoring.teams[B].score).toEqual(teamBScore);

      expect(availableProvisions(store, A, BiasKind.NEXT_TO_SAME_TEAM)).toEqual(
        availableProvisionsForA
      );
      expect(provided(store, A, BiasKind.NEXT_TO_SAME_TEAM)).toEqual(
        providedForA
      );
      expect(availableProvisions(store, B, BiasKind.NEXT_TO_SAME_TEAM)).toEqual(
        availableProvisionsForB
      );
      expect(provided(store, B, BiasKind.NEXT_TO_SAME_TEAM)).toEqual(
        providedForB
      );
    });
  });

  describe("with NEXT_TO biases", () => {
    const teamASize = 2;
    const teamBSize = 3;
    test("NEXT_TO bias counts towards score for placed team members next to the other team", () => {
      const store = fromPicture(
        teamsFor(
          [
            teamFor(A, teamASize, maximumSize),
            teamFor(B, teamBSize, maximumSize),
          ],
          templateFor([A, B, C], defaultSize, maximumSize)
        ),
        [biasSpecFrom(A, B, BiasKind.NEXT_TO)],
        // prettier-ignore
        [
          [A, O],
          [O, B],
        ]
      );
      const availableProvisionsForA = providersFromPicture(
        // prettier-ignore
        [
          [_, _],
          [_, _],
        ]
      );

      const availableProvisionsForB = providersFromPicture(
        // prettier-ignore
        [
          [_, _],
          [_, _],
        ]
      );

      expect(provided(store, A, BiasKind.NEXT_TO_SAME_TEAM)).toEqual(
        providersFromPicture(
          // prettier-ignore
          [
            [_, _],
            [_, _],
          ]
        )
      );

      expect(provided(store, B, BiasKind.NEXT_TO_SAME_TEAM)).toEqual(
        providersFromPicture(
          // prettier-ignore
          [
            [_, _],
            [_, _],
          ]
        )
      );

      expect(provided(store, A, BiasKind.NEXT_TO)).toEqual(
        providersFromPicture(
          // prettier-ignore
          [
            [[B], _],
            [_,   _],
          ]
        )
      );

      expect(provided(store, B, BiasKind.NEXT_TO)).toEqual(
        providersFromPicture(
          // prettier-ignore
          [
            [_,   _],
            [_, [A]],
          ]
        )
      );

      const expectedAScore = Math.floor(
        (1000 * (0 + 1)) / (teamASize + teamASize)
      );
      expect(store.evaluation.scoring.teams["A"].score).toEqual(expectedAScore);
      const expectedBScore = Math.floor(
        (1000 * (0 + 1)) / (teamBSize + teamBSize)
      );
      expect(store.evaluation.scoring.teams["B"].score).toEqual(expectedBScore);
      expect(store.evaluation.scoring.score).toEqual(
        Math.floor((expectedAScore + expectedBScore) / 2)
      );

      expect(availableProvisions(store, A, BiasKind.NEXT_TO)).toEqual(
        availableProvisionsForA
      );
      expect(availableProvisions(store, B, BiasKind.NEXT_TO)).toEqual(
        availableProvisionsForB
      );
    });

    test("NEXT_TO bias does not count towards score if a team member is not next to the other team", () => {
      const store = fromPicture(
        teamsFor(
          [teamFor(A, 2, maximumSize), teamFor(B, 3, maximumSize)],
          templateFor([A, B, C], defaultSize, maximumSize)
        ),
        [biasSpecFrom(A, B, BiasKind.NEXT_TO)],
        [
          [A, O], //
          [O, X], //
        ]
      );

      const availableProvisionsForA = providersFromPicture(
        // prettier-ignore
        [
          [_,   _],
          [_, [B]],
        ]
      );
      const providedForA = providersFromPicture(
        // prettier-ignore
        [
          [_, _],
          [_, _],
        ]
      );
      const availableProvisionsForB = providersFromPicture(
        // prettier-ignore
        [
          [_, _],
          [_, _],
        ]
      );
      const providedForB = providersFromPicture(
        // prettier-ignore
        [
          [_, _],
          [_, _],
        ]
      );

      const expectedAScore = Math.floor(
        (1000 * (0 + 0)) / (teamASize + teamASize)
      );
      expect(store.evaluation.scoring.teams["A"].score).toEqual(expectedAScore);
      const expectedBScore = Math.floor(
        (1000 * (0 + 0)) / (teamBSize + teamBSize)
      );
      expect(store.evaluation.scoring.teams["B"].score).toEqual(expectedBScore);
      expect(store.evaluation.scoring.score).toEqual(
        Math.floor((expectedAScore + expectedBScore) / 2)
      );

      expect(availableProvisions(store, A, BiasKind.NEXT_TO)).toEqual(
        availableProvisionsForA
      );
      expect(provided(store, A, BiasKind.NEXT_TO)).toEqual(providedForA);
      expect(availableProvisions(store, B, BiasKind.NEXT_TO)).toEqual(
        availableProvisionsForB
      );
      expect(provided(store, B, BiasKind.NEXT_TO)).toEqual(providedForB);
    });
  });
});

describe("example-based tests", () => {
  const O = "O";
  const X = "X";
  const A = "A";
  const B = "B";
  const C = "C";

  const _ = [];

  const defaultSize = 3;
  const maximumSize = 4;
  describe("with only default biases", () => {
    test("example1", () => {
      const store = fromPicture(
        teamsFor(
          [teamFor(A, 3, maximumSize), teamFor(B, 2, maximumSize)],
          templateFor([A, B], defaultSize, maximumSize)
        ),
        [],
        // prettier-ignore
        [
          [O, A, A],
          [O, O, A],
          [O, B, B],
        ]
      );

      expect(provided(store, A, BiasKind.NEXT_TO_SAME_TEAM)).toEqual(
        providersFromPicture(
          // prettier-ignore
          [
            [_, [A], [A]],
            [_,   _, [A]],
            [_,   _,   _],
          ]
        )
      );

      expect(provided(store, B, BiasKind.NEXT_TO_SAME_TEAM)).toEqual(
        providersFromPicture(
          // prettier-ignore
          [
            [_,   _,   _],
            [_,   _,   _],
            [_, [B], [B]],
          ]
        )
      );

      expect(store.evaluation.scoring.teams["A"].score).toEqual(1000);
      expect(store.evaluation.scoring.teams["B"].score).toEqual(1000);
      expect(store.evaluation.scoring.score).toEqual(1000);
    });

    test("example2", () => {
      const store = fromPicture(
        teamsFor(
          [teamFor(A, 2, maximumSize)],
          templateFor([A], defaultSize, maximumSize)
        ),
        [],
        // prettier-ignore
        [
          [O, X, O],
          [A, O, X],
          [A, O, X],
          [X, X, O],
        ]
      );

      expect(provided(store, A, BiasKind.NEXT_TO_SAME_TEAM)).toEqual(
        providersFromPicture(
          // prettier-ignore
          [
            [_,   _, _],
            [[A], _, _],
            [[A], _, _],
            [_,   _, _],
          ]
        )
      );

      expect(availableProvisions(store, A, BiasKind.NEXT_TO_SAME_TEAM)).toEqual(
        providersFromPicture(
          // prettier-ignore
          [
            [_,  _, _],
            [_,  _, _],
            [_,  _, _],
            [_,  _, _],
          ]
        )
      );

      expect(store.evaluation.scoring.teams["A"].score).toEqual(1000);
      expect(store.evaluation.scoring.score).toEqual(1000);
    });
  });

  describe("with some NEXT_TO biases", () => {
    test("example1", () => {
      const store = fromPicture(
        teamsFor(
          [teamFor(A, 3, maximumSize), teamFor(B, 2, maximumSize)],
          templateFor([A, B], defaultSize, maximumSize)
        ),
        [biasSpecFrom(A, B, BiasKind.NEXT_TO)],
        // prettier-ignore
        [
          [O, A, A],
          [O, O, A],
          [O, B, B],
        ]
      );

      expect(provided(store, A, BiasKind.NEXT_TO_SAME_TEAM)).toEqual(
        providersFromPicture(
          // prettier-ignore
          [
            [_, [A], [A]],
            [_,   _, [A]],
            [_,   _,   _],
          ]
        )
      );

      expect(provided(store, A, BiasKind.NEXT_TO)).toEqual(
        providersFromPicture(
          // prettier-ignore
          [
            [_,  _,   _],
            [_,  _, [B]],
            [_,  _,   _],
          ]
        )
      );

      expect(provided(store, B, BiasKind.NEXT_TO_SAME_TEAM)).toEqual(
        providersFromPicture(
          // prettier-ignore
          [
            [_,   _,   _],
            [_,   _,   _],
            [_, [B], [B]],
          ]
        )
      );

      expect(provided(store, B, BiasKind.NEXT_TO)).toEqual(
        providersFromPicture(
          // prettier-ignore
          [
            [_,   _,   _],
            [_,   _,   _],
            [_, [A], [A]],
          ]
        )
      );

      const expectedAScore = Math.floor((1000 * (3 + 1)) / (3 + 3));
      expect(store.evaluation.scoring.teams["A"].score).toEqual(expectedAScore);
      const expectedBScore = Math.floor((1000 * (2 + 2)) / (2 + 2));
      expect(store.evaluation.scoring.teams["B"].score).toEqual(expectedBScore);
      expect(store.evaluation.scoring.score).toEqual(
        Math.floor((expectedAScore + expectedBScore) / 2)
      );
    });

    test("example2", () => {
      const store = fromPicture(
        teamsFor(
          [
            teamFor(A, 2, maximumSize),
            teamFor(B, 2, maximumSize),
            teamFor(C, 2, maximumSize),
          ],
          templateFor([A, B, C], defaultSize, maximumSize)
        ),
        [
          biasSpecFrom(A, B, BiasKind.NEXT_TO),
          biasSpecFrom(A, C, BiasKind.NEXT_TO),
        ],
        // prettier-ignore
        [
          [A, O, O],
          [O, X, X],
          [O, X, X],
        ]
      );

      expect(provided(store, A, BiasKind.NEXT_TO_SAME_TEAM)).toEqual(
        providersFromPicture(
          // prettier-ignore
          [
            [_, _, _],
            [_, _, _],
            [_, _, _],
          ]
        )
      );

      expect(provided(store, A, BiasKind.NEXT_TO)).toEqual(
        providersFromPicture(
          // prettier-ignore
          [
            [_,  _,   _],
            [_,  _,   _],
            [_,  _,   _],
          ]
        )
      );

      expect(availableProvisions(store, A, BiasKind.NEXT_TO_SAME_TEAM)).toEqual(
        providersFromPicture(
          // prettier-ignore
          [
            [_,    _,  _],
            [_,  [A],  _],
            [_,    _,  _],
          ]
        )
      );

      expect(availableProvisions(store, A, BiasKind.NEXT_TO)).toEqual(
        providersFromPicture(
          // prettier-ignore
          [
            [_,       _,  _],
            [_,  [B, C],  _],
            [_,       _,  _],
          ]
        )
      );
    });
  });

  describe("examples from play-testing", () => {
    test("example1", () => {
      const store = fromSpecsAndPicture(
        "5x5_5wXgAA--v2",
        "A3B2C4_ABntACntBCnt_v1",
        // prettier-ignore
        [
          [C, A, A, O, O],
          [C, A, B, O, O],
          [O, O, O, B, O],
          [X, X, C, C, O],
          [O, O, O, O, O],
        ]
      );

      expect(provided(store, A, BiasKind.NEXT_TO_SAME_TEAM)).toEqual(
        providersFromPicture(
          // prettier-ignore
          [
            [_, [A], [A],   _,   _],
            [_, [A],   _,   _,   _],
            [_,   _,   _,   _,   _],
            [_,   _,   _,   _,   _],
            [_,   _,   _,   _,   _],
          ]
        )
      );

      expect(availableProvisions(store, A, BiasKind.NEXT_TO_SAME_TEAM)).toEqual(
        providersFromPicture(
          // prettier-ignore
          [
            [_,   _,   _,   _,   _],
            [_,   _,   _,   _,   _],
            [_,   _,   _,   _,   _],
            [_,   _,   _,   _,   _],
            [_,   _,   _,   _,   _],
          ]
        )
      );

      expect(provided(store, A, BiasKind.NEXT_TO)).toEqual(
        providersFromPicture(
          // prettier-ignore
          [
            [_, [B,C], [B],   _,   _],
            [_, [B,C],   _,   _,   _],
            [_,     _,   _,   _,   _],
            [_,     _,   _,   _,   _],
            [_,     _,   _,   _,   _],
          ]
        )
      );

      expect(availableProvisions(store, A, BiasKind.NEXT_TO)).toEqual(
        providersFromPicture(
          // prettier-ignore
          [
            [_,   _,   _,   _,   _],
            [_,   _,   _,   _,   _],
            [_,   _,   _,   _,   _],
            [_,   _,   _,   _,   _],
            [_,   _,   _,   _,   _],
          ]
        )
      );

      expect(provided(store, B, BiasKind.NEXT_TO_SAME_TEAM)).toEqual(
        providersFromPicture(
          // prettier-ignore
          [
            [_,   _,   _,   _,   _],
            [_,   _, [B],   _,   _],
            [_,   _,   _, [B],   _],
            [_,   _,   _,   _,   _],
            [_,   _,   _,   _,   _],
          ]
        )
      );

      expect(availableProvisions(store, B, BiasKind.NEXT_TO_SAME_TEAM)).toEqual(
        providersFromPicture(
          // prettier-ignore
          [
            [_,   _,   _,   _,   _],
            [_,   _,   _,   _,   _],
            [_,   _,   _,   _,   _],
            [_,   _,   _,   _,   _],
            [_,   _,   _,   _,   _],
          ]
        )
      );

      expect(provided(store, B, BiasKind.NEXT_TO)).toEqual(
        providersFromPicture(
          // prettier-ignore
          [
            [_,   _,   _,   _,   _],
            [_,   _, [A],   _,   _],
            [_,   _,   _, [C],   _],
            [_,   _,   _,   _,   _],
            [_,   _,   _,   _,   _],
          ]
        )
      );

      expect(availableProvisions(store, B, BiasKind.NEXT_TO)).toEqual(
        providersFromPicture(
          // prettier-ignore
          [
            [_,   _,   _,   _,   _],
            [_,   _,   _,   _,   _],
            [_,   _,   _,   _,   _],
            [_,   _,   _,   _,   _],
            [_,   _,   _,   _,   _],
          ]
        )
      );

      expect(provided(store, C, BiasKind.NEXT_TO_SAME_TEAM)).toEqual(
        providersFromPicture(
          // prettier-ignore
          [
            [[C], _,   _,   _,   _],
            [[C], _,   _,   _,   _],
            [_,   _,   _,   _,   _],
            [_,   _, [C], [C],   _],
            [_,   _,   _,   _,   _],
          ]
        )
      );

      expect(availableProvisions(store, C, BiasKind.NEXT_TO_SAME_TEAM)).toEqual(
        providersFromPicture(
          // prettier-ignore
          [
            [_,   _,   _,   _,   _],
            [_,   _,   _,   _,   _],
            [_,   _,   _,   _,   _],
            [_,   _,   _,   _,   _],
            [_,   _,   _,   _,   _],
          ]
        )
      );

      expect(provided(store, C, BiasKind.NEXT_TO)).toEqual(
        providersFromPicture(
          // prettier-ignore
          [
            [[A], _,   _,   _,   _],
            [[A], _,   _,   _,   _],
            [_,   _,   _,   _,   _],
            [_,   _, [B], [B],   _],
            [_,   _,   _,   _,   _],
          ]
        )
      );

      expect(availableProvisions(store, C, BiasKind.NEXT_TO)).toEqual(
        providersFromPicture(
          // prettier-ignore
          [
            [_,   _,   _,   _,   _],
            [_,   _,   _,   _,   _],
            [_,   _,   _,   _,   _],
            [_, [A],   _,   _,   _],
            [_,   _,   _,   _,   _],
          ]
        )
      );

      // A -> A, B, C
      const expectedAScore = Math.floor((1000 * (3 + 3 + 2)) / (3 + 3 + 3));
      expect(store.evaluation.scoring.teams["A"].score).toEqual(expectedAScore);
      // B -> B, A, C
      const expectedBScore = Math.floor((1000 * (2 + 1 + 1)) / (2 + 2 + 2));
      expect(store.evaluation.scoring.teams["B"].score).toEqual(expectedBScore);
      // C -> C, A, B
      const expectedCScore = Math.floor((1000 * (4 + 2 + 2)) / (4 + 4 + 4));
      expect(store.evaluation.scoring.teams["C"].score).toEqual(expectedCScore);
      expect(store.evaluation.scoring.score).toEqual(
        Math.floor((expectedAScore + expectedBScore + expectedCScore) / 3)
      );
    });
  });
});

describe("fromPicture", () => {
  const O = "O";
  const X = "X";
  const A = "A";
  const B = "B";
  const C = "C";
  test("all features", () => {
    const expectedStore = storeFor(
      teamsFor(
        [teamFor(A, 1, 2), teamFor(B, 2, 2)],
        templateFor([A, B, C], 1, 2)
      ),
      gridFor(3, 3)
    );
    expectedStore.grid.addSeat(positionFor(1, 0));
    expectedStore.grid.addSeat(positionFor(0, 1));
    expectedStore.grid.addSeat(positionFor(1, 1));
    expectedStore.grid.addSeat(positionFor(2, 1));
    expectedStore.grid.addSeat(positionFor(1, 2));

    expectedStore.selectTeam("B");
    expectedStore.toggleMemberPlacement(positionFor(1, 0));
    expectedStore.toggleMemberPlacement(positionFor(1, 1));
    expectedStore.selectTeam("A");
    expectedStore.toggleMemberPlacement(positionFor(2, 1));

    expectedStore.teams.biases.setBias(A, B, BiasKind.NEXT_TO);

    const store = fromPicture(
      teamsFor(
        [teamFor(A, 1, 2), teamFor(B, 2, 2)],
        templateFor([A, B, C], 1, 2)
      ),
      [biasSpecFrom(A, B, BiasKind.NEXT_TO)],
      [
        [O, B, O], //
        [X, B, A], //
        [O, X, O], //
      ]
    );
    expect(store.grid.seats).toEqual(expectedStore.grid.seats);
    expect(store.teams.biases).toEqual(expectedStore.teams.biases);
    expect(store).toEqual(expectedStore);
  });

  test("nothing placed, but still have teams", () => {
    const expectedStore = storeFor(
      teamsFor(
        [teamFor(A, 1, 2), teamFor(B, 1, 2)],
        templateFor([A, B, C], 1, 2)
      ),
      gridFor(3, 3)
    );
    expectedStore.grid.addSeat(positionFor(1, 0));
    expectedStore.grid.addSeat(positionFor(0, 1));
    expectedStore.grid.addSeat(positionFor(1, 1));
    expectedStore.grid.addSeat(positionFor(2, 1));
    expectedStore.grid.addSeat(positionFor(1, 2));

    const store = fromPicture(
      teamsFor(
        [teamFor(A, 1, 2), teamFor(B, 1, 2)],
        templateFor([A, B, C], 1, 2)
      ),
      [],
      [
        [O, X, O], //
        [X, X, X], //
        [O, X, O], //
      ]
    );
    expect(store.grid.seats).toEqual(expectedStore.grid.seats);
    expect(store.teams.biases).toEqual(expectedStore.teams.biases);
    expect(store).toEqual(expectedStore);
  });

  test("nothing placed, but still have teams and biases", () => {
    const expectedStore = storeFor(
      teamsFor(
        [teamFor(A, 1, 2), teamFor(B, 1, 2)],
        templateFor([A, B, C], 1, 2)
      ),
      gridFor(3, 3)
    );
    expectedStore.grid.addSeat(positionFor(1, 0));
    expectedStore.grid.addSeat(positionFor(0, 1));
    expectedStore.grid.addSeat(positionFor(1, 1));
    expectedStore.grid.addSeat(positionFor(2, 1));
    expectedStore.grid.addSeat(positionFor(1, 2));

    expectedStore.teams.biases.setBias(A, B, BiasKind.NEXT_TO);

    const store = fromPicture(
      teamsFor(
        [teamFor(A, 1, 2), teamFor(B, 1, 2)],
        templateFor([A, B, C], 1, 2)
      ),
      [biasSpecFrom(A, B, BiasKind.NEXT_TO)],
      [
        [O, X, O], //
        [X, X, X], //
        [O, X, O], //
      ]
    );
    expect(store.grid.seats).toEqual(expectedStore.grid.seats);
    expect(store.teams.biases).toEqual(expectedStore.teams.biases);
    expect(store).toEqual(expectedStore);
  });

  test("no seats at all, but still have teams", () => {
    const expectedStore = storeFor(
      teamsFor(
        [teamFor(A, 1, 2), teamFor(B, 1, 2)],
        templateFor([A, B, C], 1, 2)
      ),
      gridFor(3, 3)
    );

    const store = fromPicture(
      teamsFor(
        [teamFor(A, 1, 2), teamFor(B, 1, 2)],
        templateFor([A, B, C], 1, 2)
      ),
      [],
      [
        [O, O, O], //
        [O, O, O], //
        [O, O, O], //
      ]
    );
    expect(store.grid.seats).toEqual(expectedStore.grid.seats);
    expect(store.teams.biases).toEqual(expectedStore.teams.biases);
    expect(store).toEqual(expectedStore);
  });

  test("no seats at all, but still have teams and biases", () => {
    const expectedStore = storeFor(
      teamsFor(
        [teamFor(A, 1, 2), teamFor(B, 1, 2)],
        templateFor([A, B, C], 1, 2)
      ),
      gridFor(3, 3)
    );

    expectedStore.teams.biases.setBias(A, B, BiasKind.NEXT_TO);

    const store = fromPicture(
      teamsFor(
        [teamFor(A, 1, 2), teamFor(B, 1, 2)],
        templateFor([A, B, C], 1, 2)
      ),
      [biasSpecFrom(A, B, BiasKind.NEXT_TO)],
      [
        [O, O, O], //
        [O, O, O], //
        [O, O, O], //
      ]
    );
    expect(store.grid.seats).toEqual(expectedStore.grid.seats);
    expect(store.teams.biases).toEqual(expectedStore.teams.biases);
    expect(store).toEqual(expectedStore);
  });
});

const SPACE = "O";
const UNOCCUPIED_SEAT = "X";

function fromPicture(teams, biasSpecs, picture) {
  const width = picture[0].length;
  const height = picture.length;
  const store = storeFor(teams, gridFor(width, height));
  applyPictureToStore(store, picture);
  applyBiasSpecsToStore(store, biasSpecs);

  return store;
}

function fromSpecsAndPicture(gridSpec, teamsSpec, picture) {
  const problem = parseProblemFrom(gridSpec, teamsSpec);
  const store = problem.toStore();
  applyPictureToStore(store, picture);

  return store;
}

function applyPictureToStore(store, picture) {
  for (let y = 0; y < store.grid.height; y++) {
    const row = picture[y];
    for (let x = 0; x < store.grid.width; x++) {
      const ch = row[x];
      const position = positionFor(x, y);
      if (ch === SPACE) {
        // skip
      } else if (ch === UNOCCUPIED_SEAT) {
        store.grid.addSeat(position);
      } else {
        const teamName = ch;
        store.grid.addSeat(position);
        store.selectTeam(teamName);
        store.toggleMemberPlacement(position);
      }
    }
  }
}

function applyBiasSpecsToStore(store, biasSpecs) {
  biasSpecs.forEach((biasSpec) => {
    store.teams.biases.setBias(
      biasSpec.from_name,
      biasSpec.to_name,
      biasSpec.bias_kind
    );
  });
}

function providersFromPicture(picture) {
  const width = picture[0].length;
  const height = picture.length;
  const providers = [];
  for (let y = 0; y < height; y++) {
    const row = picture[y];
    for (let x = 0; x < width; x++) {
      const position = positionFor(x, y);
      const providingTeams = row[x];
      providingTeams.forEach((team) => {
        providers.push({
          position,
          team,
        });
      });
    }
  }
  providers.sort((lhs, rhs) => {
    if (lhs.position === rhs.position) {
      return lhs.team.localeCompare(rhs.team);
    } else {
      return positionCompare(lhs.position, rhs.position);
    }
  });
  return providers;
}
