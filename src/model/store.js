import React from "react";
import { useReducer } from "react";
import { gridFor, addRandomSeats } from "./grid";
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

export const StoreProvider = ({ children }) => {
  const defaultSize = 5;
  const maximumSize = 10;
  const initialState = storeFor(
    teamsFor(
      [teamFor("A", 3), teamFor("B", 2), teamFor("C", 4)],
      templateFor(["A", "B", "C", "D", "E"], defaultSize, maximumSize)
    ),
    gridFor(10, 10)
  );

  addRandomSeats(initialState.grid);

  const [state, dispatch] = useReducer(reducer, initialState);

  const mobXStore = useLocalStore(createStore);
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
        store.addTeam();
        break;
      default:
      // ignore
    }
    dispatch(action);
  };
}
