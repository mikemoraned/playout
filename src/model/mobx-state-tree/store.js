import { types } from "mobx-state-tree";
import { Teams } from "./team";

export const Store = types.model({
  teams: Teams,
});

export function storeFor(teams) {
  return Store.create({ teams });
}
