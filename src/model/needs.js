import { expandToNextToArea } from "./grid/grid";

export function needs(store) {
  return instantiateNeeds(store);
}

function instantiateNeeds(store) {
  return store.grid.occupied.reduce((accumulatedNeeds, occupancy) => {
    const fromTeamName = occupancy.member.teamName;
    const possibleNeighbourPositions = expandToNextToArea(
      occupancy.position,
      store.grid
    );
    console.log("possible", possibleNeighbourPositions);
    const availablePositions = possibleNeighbourPositions.filter((p) =>
      store.grid.hasSeat(p)
    );
    console.log("available", availablePositions);
    const reducer = (accumulatedNeeds, availablePosition) => {
      const farp = store.teams.list.reduce((accumulatedNeeds, toTeamName) => {
        const biasKind = store.teams.biases.getBias(fromTeamName, toTeamName);
        if (biasKind) {
          return accumulatedNeeds.concat([
            {
              from: {
                teamName: fromTeamName,
                position: occupancy.position,
              },
              to: {
                teamName: toTeamName,
                position: availablePosition,
              },
              biasKind,
            },
          ]);
        } else {
          return accumulatedNeeds;
        }
      }, accumulatedNeeds);
      console.log("position", availablePosition, "needs", farp);
      return farp;
    };
    const needsForOccupied = availablePositions.reduce(
      reducer,
      accumulatedNeeds
    );
    console.log("occupancy", occupancy, "needs", needsForOccupied);
    return needsForOccupied;
  }, []);
}
