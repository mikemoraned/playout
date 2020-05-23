import { types } from "mobx-state-tree";

export const Team = types.model({
  name: types.string,
  size: types.number,
});

export const Teams = types
  .model({
    teams: types.array(Team),
    next: types.string, // TODO: change to be a reference
  })
  .actions((self) => ({
    selectTeam(name) {
      self.next = name;
    },
  }));

export function teamFor(name, size) {
  return Team.create({ name, size });
}

export function teamsFor(teams) {
  return Teams.create({ teams, next: teams[0].name });
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
