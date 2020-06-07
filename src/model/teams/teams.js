import { types } from "mobx-state-tree";
import { Biases, biasesFor } from "./bias";
import { Team, teamFor } from "./team";
import { Template } from "./template";

export const Teams = types
  .model("Teams", {
    teams: types.array(Team),
    selected: types.reference(Team),
    template: Template,
    biases: Biases,
  })
  .actions((self) => ({
    selectTeam(name) {
      const team = self.teams.find((t) => t.name === name);
      if (team === undefined) {
        throw new Error(`unknown team: ${name}`);
      }
      self.selected = team;
    },
    selectNextTeamWithRemainingUnplaced(startingTeamName) {
      const teamIndex = self.teams.findIndex(
        (t) => t.name === startingTeamName
      );
      if (teamIndex === -1) {
        throw new Error(`unknown team: ${startingTeamName}`);
      }
      for (
        let indexOffset = 0;
        indexOffset < self.teams.length;
        indexOffset++
      ) {
        const index = (teamIndex + indexOffset) % self.teams.length;
        const team = self.teams[index];
        if (team.remaining > 0) {
          self.selectTeam(team.name);
          break;
        }
      }
    },
    addTeam() {
      if (!self.canAdd) {
        throw new Error(`cannot add team`);
      }
      const remaining = self.template.names.filter((n) => {
        return self.teams.findIndex((t) => t.name === n) === -1;
      });
      self.teams.push(
        teamFor(
          remaining[0],
          self.template.defaultSize,
          self.template.maximumSize
        )
      );
      self.biases.expandBiases(self.list);
    },
    addTeamMember(name) {
      const team = self.teams.find((t) => t.name === name);
      team.addTeamMember();
    },
    rotateBias(fromTeamName, toTeamName) {
      self.biases.rotateBias(fromTeamName, toTeamName);
    },
  }))
  .views((self) => ({
    get canAdd() {
      return self.teams.length < self.template.names.length;
    },
    get next() {
      return self.selected.name;
    },
    get list() {
      return self.teams;
    },
    get totalMembers() {
      const total = self.teams.reduce((sum, team) => team.size + sum, 0);
      return total;
    },
  }));

export function teamsFor(teams, template) {
  return Teams.create({
    teams,
    selected: teams[0].name,
    template,
    biases: biasesFor(teams),
  });
}