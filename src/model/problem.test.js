import { Problem } from "./problem";
import { GridSpec } from "./grid/grid_spec";
import { TeamsSpec, TeamSpec, BiasAssignmentSpec } from "./teams/teams_spec";
import { BiasKind } from "./teams/bias";
import { defaultTemplate } from "./teams/template";
import { storeFor } from "./store";
import { teamsFor } from "./teams/teams";
import { teamFor } from "./teams/team";
import { gridFor, positionFor } from "./grid/grid";
import { getSnapshot } from "mobx-state-tree";

test("can convert into a Store", () => {
  const problem = Problem.create({
    grid: GridSpec.create({
      width: 2,
      height: 2,
      seats: ["0_0", "1_1"],
    }),
    teams: TeamsSpec.create({
      teams: [
        TeamSpec.create({ name: "A", size: 2 }),
        TeamSpec.create({ name: "B", size: 3 }),
      ],
      biases: [
        BiasAssignmentSpec.create({
          from_name: "A",
          to_name: "B",
          bias_kind: BiasKind.NEXT_TO,
        }),
      ],
    }),
  });
  const store = problem.toStore();

  const template = defaultTemplate();
  const expectedStore = storeFor(
    teamsFor(
      [
        teamFor("A", 2, template.maximumSize),
        teamFor("B", 3, template.maximumSize),
      ],
      template
    ),
    gridFor(2, 2)
  );
  expectedStore.grid.addSeat(positionFor(0, 0));
  expectedStore.grid.addSeat(positionFor(1, 1));
  expectedStore.teams.biases.setBias("A", "B", BiasKind.NEXT_TO);

  expect(getSnapshot(store)).toEqual(getSnapshot(expectedStore));
});
