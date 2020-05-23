import { types } from "mobx-state-tree";
import makeInspectable from "mobx-devtools-mst";
import { Teams } from "./team";
import { teamFor, teamsFor } from "./team";

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

export function createStore() {
  console.log("creating mst initial state");
  const store = storeFor(
    teamsFor([teamFor("A", 3), teamFor("B", 2), teamFor("C", 4)])
  );

  makeInspectable(store);
  return store;
}
