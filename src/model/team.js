import { types } from "mobx-state-tree";
import { Biases, biasesFor } from "./bias";

export const Team = types
  .model("Team", {
    id: types.identifier,
    name: types.string,
    nextIndex: types.number,
    placed: types.array(types.boolean),
    maximumSize: types.number,
  })
  .actions((self) => ({
    addTeamMember() {
      if (!self.canAdd) {
        throw new Error("cannot add team member");
      }
      self.placed.push(false);
    },
    placeMember() {
      const member = memberFor(self.name, self.nextIndex);
      self.placed[self.nextIndex] = true;
      self.nextIndex = self.placed.findIndex((taken) => !taken);
      return member;
    },
    returnMember(member) {
      self.placed[member.index] = false;
      self.nextIndex = self.placed.findIndex((taken) => !taken);
    },
  }))
  .views((self) => ({
    get canAdd() {
      return self.size < self.maximumSize;
    },
    get size() {
      return self.placed.length;
    },
    get remaining() {
      const totalOccupied = self.placed.reduce(
        (accum, occupied) => (occupied ? accum + 1 : accum),
        0
      );
      return self.placed.length - totalOccupied;
    },
    get next() {
      return self.nextIndex;
    },
  }));

export function teamFor(name, size, maximumSize) {
  const placed = Array(size).fill(false);
  return Team.create({ id: name, name, nextIndex: 0, placed, maximumSize });
}

export const Template = types.model("Template", {
  names: types.array(types.string),
  defaultSize: types.number,
  maximumSize: types.number,
});

export function templateFor(names, defaultSize, maximumSize) {
  return Template.create({
    names,
    defaultSize,
    maximumSize,
  });
}

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

export const Member = types.model("Member", {
  id: types.identifier,
  team: types.string,
  index: types.number,
});

export function memberFor(teamName, index) {
  return Member.create({
    id: `${teamName}_${index}`,
    team: teamName,
    index,
  });
}
