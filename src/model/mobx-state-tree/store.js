import { types } from "mobx-state-tree";
import { Teams } from "./team";

export const Store = types
  .model({
    teams: Teams,
  })
  .actions((self) => ({
    selectTeam(name) {
      self.teams.selectTeam(name);
    },
  }));

export function storeFor(teams) {
  return Store.create({ teams });
}
