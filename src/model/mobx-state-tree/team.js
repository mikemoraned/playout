import { types } from "mobx-state-tree";

export const Team = types.model({
  id: types.identifier,
  name: types.string,
  size: types.number,
});

export const Teams = types
  .model({
    teams: types.array(Team),
    selected: types.reference(Team),
  })
  .actions((self) => ({
    selectTeam(name) {
      const team = self.teams.find((t) => t.name === name);
      if (team === undefined) {
        throw new Error(`unknown team: ${name}`);
      }
      self.selected = team;
    },
  }))
  .views((self) => ({
    get next() {
      return self.selected.name;
    },
  }));

export function teamFor(name, size) {
  return Team.create({ id: name, name, size });
}

export function teamsFor(teams) {
  return Teams.create({ teams, selected: teams[0].name });
}

// export function teamFor(name, size) {
//     const placed = new Array(size);
//     for (let index = 0; index < placed.length; index++) {
//       placed[index] = false;
//     }
//     return {
//       name,
//       next: 0,
//       placed,
//       remaining: size,
//       canAdd: true,
//     };
//   }

//   export function templateFor(names, defaultSize, maximumSize) {
//     return {
//       names,
//       defaultSize,
//       maximumSize,
//     };
//   }

//   export function teamsFor(teams, template) {
//     return {
//       list: teams,
//       next: teams[0].name,
//       template,
//       canAdd: true,
//       biases: biasesFor(teams),
//     };
//   }
