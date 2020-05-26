import { types } from "mobx-state-tree";
import makeInspectable from "mobx-devtools-mst";
import { Teams, memberFor } from "./team";
import { Grid, gridFor, positionFor, occupancyFor } from "./grid";
import { teamFor, teamsFor, templateFor } from "./team";
import {} from "./grid";

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
      const hasSeat = self.grid.hasSeat(position);

      const currentOccupancy = self.grid.findOccupancy(position);

      if (currentOccupancy) {
        // occupied = occupied.filter(
        //   (o) => o.member.id !== currentOccupancy.member.id
        // );
        // const team = teams.list.find(
        //   (t) => t.name === currentOccupancy.member.team
        // );
        // return evaluate({
        //   ...state,
        //   teams: {
        //     ...teams,
        //     list: teamListWithReplacedTeam(
        //       teams.list,
        //       teamWithMemberReturned(team, currentOccupancy.member)
        //     ),
        //   },
        // }
      } else {
        const selectedTeam = self.teams.selected;
        if (selectedTeam.remaining > 0 && hasSeat) {
          const member = selectedTeam.placeMember(position);
          self.grid.addOccupancy(occupancyFor(position, member));
        }
      }
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
