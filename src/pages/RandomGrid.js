import React from "react";
import { StoreProvider } from "../model/contexts";
import { randomEasyProblem } from "../model/problem";
import { Grid } from "../components/Grid";

export default function RandomGrid() {
  const store = randomEasyProblem().toStore();
  const randomSeats = store.grid.seats.filter(() => Math.random() <= 0.3);
  randomSeats.forEach((position) => {
    store.toggleMemberPlacement(position);
  });
  return (
    <StoreProvider initialStore={store}>
      <Grid />
    </StoreProvider>
  );
}
