import React from "react";
import { types } from "mobx-state-tree";
import { Teams } from "./teams/teams";
import { Grid } from "./grid/grid";
import { occupancyFor } from "./grid/occupancy";
import { UndoToggleMemberPlacement } from "./undo";
import { evaluate } from "./evaluation";
import { useLocalStore } from "mobx-react";

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
        const team = self.teams.list.find(
          (t) => t.name === currentOccupancy.member.team
        );
        team.returnMember(currentOccupancy.member);
        self.teams.selectTeam(currentOccupancy.member.team);
        self.grid.removeOccupancy(currentOccupancy);
        changeMade = true;
      } else {
        const selectedTeam = self.teams.selected;
        if (selectedTeam.remaining > 0 && self.grid.hasSeat(position)) {
          const member = selectedTeam.placeMember(position);
          self.grid.addOccupancy(occupancyFor(position, member));
          self.teams.selectNextTeamWithRemainingUnplaced(selectedTeam.name);
          changeMade = true;
        } else {
          changeMade = false;
        }
      }
      return changeMade;
    },
    toggleMemberPlacement(position) {
      const updated = self.toggleMemberPlacementWithoutUndo(position);
      if (updated) {
        self.undos.push(UndoToggleMemberPlacement.create({ position }));
      }
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
  }))
  .views((self) => ({
    canUndo() {
      return self.undos.length > 0;
    },
    get evaluation() {
      return evaluate(self);
    },
  }));

export function storeFor(teams, grid) {
  const defaultMode = Mode.create({ editable: true });
  return Store.create({ teams, grid, mode: defaultMode });
}

export const StoreContext = React.createContext(null);

export const StoreProvider = ({ initialStore, children }) => {
  const mobXStore = useLocalStore(() => initialStore);

  return (
    <StoreContext.Provider value={{ store: mobXStore }}>
      {children}
    </StoreContext.Provider>
  );
};
