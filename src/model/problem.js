import { types } from "mobx-state-tree";
import { storeFor } from "./store";
import makeInspectable from "mobx-devtools-mst";
import { gridFor } from "./grid/grid";
import { parseGridSpec } from "./grid/grid_spec.format";
import { parseTeamsSpec } from "./teams/team_spec.format";
import { GridSpec } from "./grid/grid_spec";
import { TeamsSpec } from "./teams/teams_spec";
import { TeamSpec } from "./teams/team_spec";
import { defaultTemplate } from "./teams/template";

export const Problem = types
  .model("Problem", {
    grid: GridSpec,
    teams: TeamsSpec,
  })
  .views((self) => ({
    toStore() {
      console.log("creating mst initial state");
      const store = storeFor(
        self.teams.toTeams(),
        gridFor(self.grid.width, self.grid.height)
      );

      self.grid.seats.forEach((position) => {
        store.grid.addSeat(position);
      });

      makeInspectable(store);
      return store;
    },
  }));

export function parseProblemFrom(gridSpec, teamsSpec) {
  return Problem.create({
    grid: parseGridSpec(gridSpec),
    teams: parseTeamsSpec(teamsSpec, defaultTemplate()),
  });
}

export function defaultTeamsSpec() {
  return TeamsSpec.create({
    teams: [
      TeamSpec.create({ name: "A", size: 3 }),
      TeamSpec.create({ name: "B", size: 2 }),
      TeamSpec.create({ name: "C", size: 4 }),
    ],
    biases: [],
  });
}

export function randomProblemWithGridSize(width, height) {
  const emptyProblem = Problem.create({
    grid: gridFor(width, height).toGridSpec(),
    teams: defaultTeamsSpec(),
  });

  const store = emptyProblem.toStore();
  store.randomiseSeats();
  return store.toProblem();
}

export function randomEasyProblem() {
  return randomProblemWithGridSize(10, 10);
}

export function randomHardProblem() {
  return randomProblemWithGridSize(5, 5);
}
