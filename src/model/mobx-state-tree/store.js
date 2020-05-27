import { types } from "mobx-state-tree";
import makeInspectable from "mobx-devtools-mst";
import { Teams } from "./team";
import { Grid, gridFor, occupancyFor } from "./grid";
import { teamFor, teamsFor, templateFor } from "./team";

export const Store = types
  .model({
    teams: Teams,
    grid: Grid,
  })
  .actions((self) => ({
    selectTeam(name) {
      self.teams.selectTeam(name);
    },
    addTeam() {
      self.teams.addTeam();
    },
    addTeamMember(name) {
      self.teams.addTeamMember(name);
    },
    toggleMemberPlacement(position) {
      const currentOccupancy = self.grid.findOccupancy(position);

      if (currentOccupancy) {
        const team = self.teams.list.find(
          (t) => t.name === currentOccupancy.member.team
        );
        team.returnMember(currentOccupancy.member);
        self.grid.removeOccupancy(currentOccupancy);
      } else {
        const selectedTeam = self.teams.selected;
        if (selectedTeam.remaining > 0 && self.grid.hasSeat(position)) {
          const member = selectedTeam.placeMember(position);
          self.grid.addOccupancy(occupancyFor(position, member));
        }
      }
    },
    rotateBias(fromTeamName, toTeamName) {
      self.teams.rotateBias(fromTeamName, toTeamName);
    },
  }));

export function storeFor(teams, grid) {
  return Store.create({ teams, grid });
}

export function createStore() {
  console.log("creating mst initial state");
  const defaultSize = 5;
  const maximumSize = 10;
  const store = storeFor(
    teamsFor(
      [
        teamFor("A", 3, maximumSize),
        teamFor("B", 2, maximumSize),
        teamFor("C", 4, maximumSize),
      ],
      templateFor(["A", "B", "C", "D", "E"], defaultSize, maximumSize)
    ),
    gridFor(10, 10)
  );

  makeInspectable(store);
  return store;
}
