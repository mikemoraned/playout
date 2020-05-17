import React from "react";
import { useReducer } from "react";
import { gridFor, addRandomSeats } from "./grid";
import { teamFor, teamsFor, templateFor } from "./team";
import { evaluate } from "./evaluation";
import { reducer } from "./reducer";

export function storeFor(teams, grid) {
  return evaluate({
    teams,
    grid,
    undos: [],
  });
}

export const StoreContext = React.createContext(null);

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

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};
