import { types } from "mobx-state-tree";
import { storeFor } from "./store";
import makeInspectable from "mobx-devtools-mst";
import { gridFor } from "./grid/grid";
import { positionFor } from "./grid/grid";
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

export function randomEasyProblem() {
  return Problem.create({
    grid: randomGridSpec(10, 10),
    teams: defaultTeamsSpec(),
  });
}

export function randomHardProblem() {
  return Problem.create({
    grid: randomGridSpec(5, 5),
    teams: defaultTeamsSpec(),
  });
}

export function randomGridSpec(width, height) {
  const minimumSeats = defaultTeamsSpec().toTeams().totalMembers;
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
