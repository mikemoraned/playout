import React from "react";
import { types } from "mobx-state-tree";
import makeInspectable from "mobx-devtools-mst";
import { Teams } from "./team";
import { Grid, gridFor, occupancyFor } from "./grid";
import { teamFor, teamsFor, templateFor } from "./team";
import { UndoToggleMemberPlacement } from "./undo";
import { evaluate } from "./evaluation";
import { positionFor } from "./grid";
import { useLocalStore } from "mobx-react";

export const Store = types
  .model({
    teams: Teams,
    grid: Grid,
    undos: types.array(UndoToggleMemberPlacement),
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
      if (currentOccupancy) {
        const team = self.teams.list.find(
          (t) => t.name === currentOccupancy.member.team
        );
        team.returnMember(currentOccupancy.member);
        self.grid.removeOccupancy(currentOccupancy);
        return true;
      } else {
        const selectedTeam = self.teams.selected;
        if (selectedTeam.remaining > 0 && self.grid.hasSeat(position)) {
          const member = selectedTeam.placeMember(position);
          self.grid.addOccupancy(occupancyFor(position, member));
          return true;
        } else {
          return false;
        }
      }
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

export const MobXStoreContext = React.createContext(null);

const initialStore = createStore();

addRandomSeats(initialStore.grid);

export const StoreProvider = ({ children }) => {
  const mobXStore = useLocalStore(() => initialStore);

  return (
    <MobXStoreContext.Provider value={{ store: mobXStore }}>
      {children}
    </MobXStoreContext.Provider>
  );
};

function addRandomSeats(grid) {
  console.log("Adding random seats");
  for (let x = 0; x < grid.width; x++) {
    for (let y = 0; y < grid.height; y++) {
      if (Math.random() < 0.5) {
        const position = positionFor(x, y);
        grid.addSeat(position);
      }
    }
  }
}
