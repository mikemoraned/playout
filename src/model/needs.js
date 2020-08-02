import { expandToNextToArea } from "./grid/grid";

export function needs(store) {
  return instantiateNeeds(store);
}

function instantiateNeeds(store) {
  // console.log(
  //   "occupied",
  //   store.grid.occupied.map((o) => `${o.position}: ${o.member.team}`)
  // );
  return store.grid.occupied.reduce((accumulatedNeeds, occupancy) => {
    const needs = needsForOccupancy(occupancy, store);
    // console.log(
    //   "team",
    //   occupancy.member.team,
    //   "position",
    //   occupancy.position,
    //   "->",
    //   needs
    // );
    return accumulatedNeeds.concat(needs);
  }, []);
}

function needsForOccupancy(occupancy, store) {
  const fromTeamName = occupancy.member.team;
  const fromPosition = occupancy.position;
  const possibleNeighbourPositions = expandToNextToArea(
    fromPosition,
    store.grid
  );
  // console.log("position", fromPosition, "possible", possibleNeighbourPositions);
  const availablePositions = possibleNeighbourPositions.filter((p) =>
    store.grid.hasSeat(p)
  );
  // console.log("available", availablePositions);
  const reducer = (accumulatedNeeds, availablePosition) => {
    const farp = store.teams.list.reduce((accumulatedNeeds, toTeam) => {
      const toTeamName = toTeam.name;
      const biasKind = store.teams.biases.getBias(fromTeamName, toTeamName);
      // console.log(fromTeamName, toTeamName, "->", biasKind);
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
    // console.log("position", availablePosition, "needs", farp);
    return farp;
  };
  const needsForOccupied = availablePositions.reduce(reducer, []);
  // console.log("occupancy", occupancy, "needs", needsForOccupied);
  return needsForOccupied;
}
