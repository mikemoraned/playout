import { storeFor } from "./store";
import { teamsFor } from "./teams/teams";
import { teamFor } from "./teams/team";
import { templateFor } from "./teams/template";
import { gridFor, positionFor } from "./grid/grid";

export function testStore() {
  const defaultSize = 3;
  const maximumSize = 4;
  const store = storeFor(
    teamsFor(
      [teamFor("A", 2, maximumSize), teamFor("B", 3, maximumSize)],
      templateFor(["A", "B", "C"], defaultSize, maximumSize)
    ),
    gridFor(2, 2)
  );
  store.grid.addSeat(positionFor(0, 0));
  store.grid.addSeat(positionFor(1, 1));
  return store;
}
