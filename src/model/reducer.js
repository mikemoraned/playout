import { rotateBias } from "./bias";
import {
  teamListWithReplacedTeam,
  teamWithMemberReturned,
  memberFor,
  teamWithMemberPlaced,
  addNewTeamFromTemplate,
  addTeamMember,
} from "./team";
import { evaluate } from "./evaluation";

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

        return evaluate({
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
        });
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

            return evaluate({
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
            });
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
        return evaluate({
          ...state,
          teams: {
            ...teams,
            next: name,
          },
        });
      } else {
        throw new Error(`unknown team: ${name}`);
      }

    case "add_team":
      if (teams.canAdd) {
        return evaluate({
          ...state,
          teams: addNewTeamFromTemplate(teams),
        });
      } else {
        throw new Error(`cannot add team`);
      }

    case "add_team_member":
      return evaluate({
        ...state,
        teams: {
          ...teams,
          list: teamListWithReplacedTeam(
            teams.list,
            addTeamMember(teams, action.name)
          ),
        },
      });

    case "rotate_bias":
      return evaluate({
        ...state,
        teams: {
          ...teams,
          biases: rotateBias(
            teams.biases,
            action.fromTeamName,
            action.toTeamName
          ),
        },
      });

    default:
      throw new Error();
  }
}
