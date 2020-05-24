import { types } from "mobx-state-tree";
import makeInspectable from "mobx-devtools-mst";
import { Teams } from "./team";
import { teamFor, teamsFor, templateFor } from "./team";

export const Store = types
  .model({
    teams: Teams,
  })
  .actions((self) => ({
    selectTeam(name) {
      self.teams.selectTeam(name);
    },
    addTeam() {
      self.teams.addTeam();
    },
  }));

export function storeFor(teams) {
  return Store.create({ teams });
}

export function createStore() {
  console.log("creating mst initial state");
  const defaultSize = 5;
  const maximumSize = 10;
  const store = storeFor(
    teamsFor(
      [teamFor("A", 3), teamFor("B", 2), teamFor("C", 4)],
      templateFor(["A", "B", "C", "D", "E"], defaultSize, maximumSize)
    )
  );

  makeInspectable(store);
  return store;
}
