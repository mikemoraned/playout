import { types } from "mobx-state-tree";

export const Team = types.model("Team", {
  id: types.identifier,
  name: types.string,
  size: types.number,
});

export const Template = types.model("Template", {
  names: types.array(types.string),
  defaultSize: types.number,
  maximumSize: types.number,
});

export const Teams = types
  .model("Teams", {
    teams: types.array(Team),
    selected: types.reference(Team),
    template: Template,
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
      self.teams.push(teamFor(remaining[0], self.template.defaultSize));
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
  }));

export function teamFor(name, size) {
  return Team.create({ id: name, name, size });
}

export function teamsFor(teams, template) {
  return Teams.create({ teams, selected: teams[0].name, template });
}

export function templateFor(names, defaultSize, maximumSize) {
  return Template.create({
    names,
    defaultSize,
    maximumSize,
  });
}
