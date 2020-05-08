import React from "react";
import { useReducer } from "react";

export function positionFor(x, y) {
  return `${x}_${y}`;
}

export function memberFor(teamName, index) {
  return {
    id: `${teamName}_${index}`,
    team: teamName,
    index,
  };
}

export function teamFor(name, size) {
  const placed = new Array(size);
  for (let index = 0; index < placed.length; index++) {
    placed[index] = false;
  }
  return {
    name,
    next: 0,
    placed,
    remaining: size,
    canAdd: true,
  };
}

export function templateFor(names, defaultSize, maximumSize) {
  return {
    names,
    defaultSize,
    maximumSize,
  };
}

export function teamsFor(teams, template) {
  return {
    list: teams,
    next: teams[0].name,
    template,
    canAdd: true,
    biases: biasesFor(teams),
  };
}

export function gridFor(width, height) {
  return {
    width,
    height,
    seats: [],
    occupied: [],
  };
}

export const BiasKind = Object.freeze({
  DISTANT: "distant",
  NONE: "none",
  NEARBY: "nearby",
  NEXT_TO: "next_to",
});

const nextBias = {};
nextBias[BiasKind.DISTANT] = BiasKind.NONE;
nextBias[BiasKind.NONE] = BiasKind.NEARBY;
nextBias[BiasKind.NEARBY] = BiasKind.NEXT_TO;
nextBias[BiasKind.NEXT_TO] = BiasKind.DISTANT;

export function biasKey(fromTeam, toTeam) {
  return `${fromTeam.name}.${toTeam.name}`;
}

export function biasesFor(teamList) {
  const biases = {};
  for (let fromIndex = 0; fromIndex < teamList.length; fromIndex++) {
    for (let toIndex = 0; toIndex < teamList.length; toIndex++) {
      const key = biasKey(teamList[fromIndex], teamList[toIndex]);
      if (fromIndex === toIndex) {
        biases[key] = null;
      } else {
        biases[key] = BiasKind.NONE;
      }
    }
  }
  return biases;
}

function expandBiases(biases, teamList) {
  const newBiases = { ...biases };
  for (let fromIndex = 0; fromIndex < teamList.length; fromIndex++) {
    for (let toIndex = 0; toIndex < teamList.length; toIndex++) {
      const key = biasKey(teamList[fromIndex], teamList[toIndex]);
      if (fromIndex === toIndex) {
        newBiases[key] = null;
      } else {
        if (biases[key]) {
          newBiases[key] = biases[key];
        } else {
          newBiases[key] = BiasKind.NONE;
        }
      }
    }
  }
  return newBiases;
}

export function storeFor(teams, grid) {
  return {
    teams,
    grid,
    undos: [],
  };
}

function addRandomSeats(grid) {
  for (let x = 0; x < grid.width; x++) {
    for (let y = 0; y < grid.height; y++) {
      if (Math.random() < 0.5) {
        grid.seats.push(positionFor(x, y));
      }
    }
  }
}

function teamWithMemberPlaced(team, member) {
  const placed = [...team.placed];
  placed[member.index] = true;
  const next = placed.findIndex((taken) => !taken);

  return {
    ...team,
    placed,
    next,
    remaining: team.remaining - 1,
  };
}

function teamWithMemberReturned(team, member) {
  const placed = [...team.placed];
  placed[member.index] = false;
  const next = placed.findIndex((taken) => !taken);

  return {
    ...team,
    placed,
    next,
    remaining: team.remaining + 1,
  };
}

function addNewTeamFromTemplate(teams) {
  const remaining = teams.template.names.filter((n) => {
    return teams.list.findIndex((t) => t.name === n) === -1;
  });
  const newList = teams.list.concat([
    teamFor(remaining[0], teams.template.defaultSize),
  ]);
  return {
    ...teams,
    list: newList,
    canAdd: remaining.length > 1,
    biases: expandBiases(teams.biases, newList),
  };
}

function addTeamMember(teams, name) {
  const team = teams.list.find((t) => t.name === name);
  if (team.placed.length === teams.template.maximumSize) {
    throw new Error("cannot add team member");
  }
  const placed = team.placed.concat([false]);
  return {
    ...team,
    placed,
    remaining: team.remaining + 1,
    canAdd: placed.length < teams.template.maximumSize,
  };
}

function rotateBias(biases, biasKey) {
  const newBiases = {
    ...biases,
  };
  if (biases[biasKey] !== null) {
    newBiases[biasKey] = nextBias[biases[biasKey]];
  }
  return newBiases;
}

function teamListWithReplacedTeam(list, team) {
  return list.map((t) => {
    if (t.name === team.name) {
      return team;
    } else {
      return t;
    }
  });
}

export function reducer(state, action) {
  const { grid, teams, undos } = state;

  switch (action.type) {
    case "toggle_place_member":
      let { occupied } = grid;
      const { seats } = grid;
      const { position } = action;

      const hasSeat = seats.indexOf(position) !== -1;

      const newUndos = action.undoable
        ? undos.concat([
            {
              type: "toggle_place_member",
              position,
              undoable: false,
            },
          ])
        : undos;

      const currentOccupancy = occupied.find((o) => o.position === position);
      if (currentOccupancy) {
        occupied = occupied.filter(
          (o) => o.member.id !== currentOccupancy.member.id
        );
        const team = teams.list.find(
          (t) => t.name === currentOccupancy.member.team
        );

        return {
          ...state,
          teams: {
            ...teams,
            list: teamListWithReplacedTeam(
              teams.list,
              teamWithMemberReturned(team, currentOccupancy.member)
            ),
          },

          grid: {
            ...grid,
            occupied,
          },

          undos: newUndos,
        };
      } else {
        const hasNextTeam = teams.next !== null;
        if (hasNextTeam) {
          let nextTeam = teams.list.find((t) => t.name === teams.next);
          const member = memberFor(nextTeam.name, nextTeam.next);

          if (nextTeam.remaining > 0 && hasSeat) {
            const newOccupancy = {
              position,
              member,
            };
            occupied = occupied.concat([newOccupancy]);
            nextTeam = teamWithMemberPlaced(nextTeam, member);

            return {
              ...state,
              teams: {
                ...teams,
                list: teamListWithReplacedTeam(teams.list, nextTeam),
              },
              grid: {
                ...grid,
                occupied,
              },
              undos: newUndos,
            };
          }
        }
      }

      return state;

    case "undo":
      const withUndoRemoved = [...undos];
      const undoAction = withUndoRemoved.pop();
      return reducer({ ...state, undos: withUndoRemoved }, undoAction);

    case "select_team":
      const { name } = action;
      const teamExists = teams.list.findIndex((t) => t.name === name) !== -1;
      if (teamExists) {
        return {
          ...state,
          teams: {
            ...teams,
            next: name,
          },
        };
      } else {
        throw new Error(`unknown team: ${name}`);
      }

    case "add_team":
      if (teams.canAdd) {
        return {
          ...state,
          teams: addNewTeamFromTemplate(teams),
        };
      } else {
        throw new Error(`cannot add team`);
      }

    case "add_team_member":
      return {
        ...state,
        teams: {
          ...teams,
          list: teamListWithReplacedTeam(
            teams.list,
            addTeamMember(teams, action.name)
          ),
        },
      };

    case "rotate_bias":
      return {
        ...state,
        teams: {
          ...teams,
          biases: rotateBias(teams.biases, action.biasKey),
        },
      };

    default:
      throw new Error();
  }
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

export function togglePlaceMemberAction(position) {
  return {
    type: "toggle_place_member",
    position,
    undoable: true,
  };
}

export function selectTeamAction(name) {
  return {
    type: "select_team",
    name,
  };
}

export function addTeamAction() {
  return { type: "add_team" };
}

export function addTeamMemberAction(name) {
  return { type: "add_team_member", name };
}

export function rotateBiasAction(biasKey) {
  return {
    type: "rotate_bias",
    biasKey,
  };
}

export function undoAction() {
  return { type: "undo" };
}
