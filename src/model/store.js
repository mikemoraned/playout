import React from "react";
import { useReducer } from "react";
import { gridFor, positionFor } from "./grid";
import { teamFor, teamsFor, templateFor } from "./team";
import { evaluate } from "./evaluation";
import { reducer } from "./reducer";
import { createStore } from "./mobx-state-tree/store";
import { useLocalStore } from "mobx-react";

export function storeFor(teams, grid) {
  return evaluate({
    teams,
    grid,
    undos: [],
  });
}

export const StoreContext = React.createContext(null);
export const MobXStoreContext = React.createContext(null);

const defaultSize = 5;
const maximumSize = 10;
const initialState = storeFor(
  teamsFor(
    [teamFor("A", 3), teamFor("B", 2), teamFor("C", 4)],
    templateFor(["A", "B", "C", "D", "E"], defaultSize, maximumSize)
  ),
  gridFor(10, 10)
);

const initialStore = createStore();

addRandomSeats(initialState.grid, initialStore.grid);

export const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const mobXStore = useLocalStore(() => initialStore);
  const mappedDispatch = mobXActionMapper(dispatch, mobXStore);

  return (
    <MobXStoreContext.Provider value={{ store: mobXStore }}>
      <StoreContext.Provider value={{ state, dispatch: mappedDispatch }}>
        {children}
      </StoreContext.Provider>
    </MobXStoreContext.Provider>
  );
};

function mobXActionMapper(dispatch, store) {
  return (action) => {
    switch (action.type) {
      case "select_team":
        store.selectTeam(action.name);
        break;
      case "add_team":
        store.addTeam();
        break;
      case "add_team_member":
        store.addTeamMember(action.name);
        break;
      case "toggle_place_member":
        store.toggleMemberPlacement(action.position);
        break;
      case "rotate_bias":
        store.rotateBias(action.fromTeamName, action.toTeamName);
        break;
      case "undo":
        store.undo();
        break;
      default:
      // ignore
    }
    dispatch(action);
  };
}

function addRandomSeats(grid, mobXGrid) {
  console.log("Adding random seats");
  for (let x = 0; x < grid.width; x++) {
    for (let y = 0; y < grid.height; y++) {
      if (Math.random() < 0.5) {
        const position = positionFor(x, y);
        grid.seats.push(position);
        mobXGrid.addSeat(position);
      }
    }
  }
}
