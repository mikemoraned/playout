import { types } from "mobx-state-tree";
import { Teams } from "./teams/teams";
import { Grid } from "./grid/grid";
import { occupancyFor } from "./grid/occupancy";
import { UndoToggleMemberPlacement } from "./undo";
import { evaluate } from "./evaluation";
import { Problem } from "./problem";
import { gradeFromProblemSpec } from "./grade";
import { availableProvisionsForAnyTeamBiases } from "./explainable_evaluation";

export const Mode = types
  .model("Mode", {
    editable: types.boolean,
  })
  .actions((self) => ({
    setPlayMode() {
      self.editable = false;
    },
    setBuildMode() {
      self.editable = true;
    },
  }))
  .views((self) => ({
    get name() {
      if (self.editable) {
        return "Build";
      } else {
        return "Play";
      }
    },
    canEditTeams() {
      return self.editable;
    },
    canEditBiases() {
      return self.editable;
    },
  }));

export const Store = types
  .model({
    teams: Teams,
    grid: Grid,
    undos: types.array(UndoToggleMemberPlacement),
    mode: Mode,
    showOpportunities: types.boolean,
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
    toggleMemberPlacementWithoutUndo(position) {
      const currentOccupancy = self.grid.findOccupancy(position);
      let changeMade = false;
      if (currentOccupancy) {
        self.removeOccupancy(currentOccupancy);
        changeMade = true;
      } else {
        const selectedTeam = self.teams.selected;
        if (selectedTeam.remaining > 0 && self.grid.hasSeat(position)) {
          const member = selectedTeam.placeMember(position);
          self.grid.addOccupancy(occupancyFor(position, member));
          changeMade = true;
        } else {
          changeMade = false;
        }
      }
      return changeMade;
    },
    removeOccupancy(currentOccupancy) {
      const team = self.teams.list.find(
        (t) => t.name === currentOccupancy.member.team
      );
      team.returnMember(currentOccupancy.member);
      self.teams.selectTeam(currentOccupancy.member.team);
      self.grid.removeOccupancy(currentOccupancy);
    },
    toggleMemberPlacement(position) {
      const updated = self.toggleMemberPlacementWithoutUndo(position);
      if (updated) {
        self.undos.push(UndoToggleMemberPlacement.create({ position }));
      }
    },
    toggleSeat(position) {
      const currentOccupancy = self.grid.findOccupancy(position);
      if (currentOccupancy) {
        self.removeOccupancy(currentOccupancy);
      }
      self.grid.toggleSeat(position);
    },
    togglePosition(position) {
      if (self.mode.name === "Build") {
        self.toggleSeat(position);
      } else {
        self.toggleMemberPlacement(position);
      }
    },
    removeAllSeats() {
      const occupiedPositions = self.grid.occupied.map((o) => o.position);
      occupiedPositions.forEach((p) => {
        self.toggleSeat(p);
      });
      self.grid.clearSeats();
    },
    randomiseSeats() {
      self.removeAllSeats();
      self.grid.randomlyAddSeats(self.teams.totalMembers);
    },
    rotateBias(fromTeamName, toTeamName) {
      self.teams.rotateBias(fromTeamName, toTeamName);
    },
    undo() {
      if (!self.canUndo()) {
        throw new Error("nothing to undo");
      }
      const undoCommand = self.undos[self.undos.length - 1];
      undoCommand.apply(self);
      self.undos.pop();
    },
    removeAllPlacements() {
      const occupiedPositions = self.grid.occupied.map((o) => o.position);
      occupiedPositions.forEach((p) => {
        self.toggleMemberPlacement(p);
      });
    },
    toggleShowOpportunities() {
      self.showOpportunities = !self.showOpportunities;
    },
  }))
  .views((self) => ({
    canUndo() {
      return self.undos.length > 0;
    },
    hasPlacements() {
      return self.grid.occupied.length > 0;
    },
    get evaluation() {
      return evaluate(self);
    },
    providingTeamOpportunitiesForPosition(position) {
      const providingTeamSet = self.opportunities
        .filter((o) => o.position === position)
        .reduce((set, o) => set.add(o.team), new Set());
      return Array.from(providingTeamSet);
    },
    get opportunities() {
      if (self.showOpportunities) {
        return availableProvisionsForAnyTeamBiases(
          self,
          self.teams.selected.name
        );
      } else {
        return [];
      }
    },
    get showOpportunitiesPossible() {
      return self.hasPlacements();
    },
    get solvable() {
      return self.teams.totalMembers <= self.grid.totalSeats;
    },
    get grade() {
      return gradeFromProblemSpec(self.toProblem());
    },
    toProblem() {
      const gridSpec = self.grid.toGridSpec();
      const teamsSpec = self.teams.toTeamsSpec();

      return Problem.create({
        grid: gridSpec,
        teams: teamsSpec,
      });
    },
  }));

export function storeFor(teams, grid) {
  const defaultMode = Mode.create({ editable: true });
  return Store.create({
    teams,
    grid,
    mode: defaultMode,
    showOpportunities: false,
  });
}
