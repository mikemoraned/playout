import { types } from "mobx-state-tree";

export const Template = types
  .model("Template", {
    names: types.array(types.string),
    defaultSize: types.number,
    maximumSize: types.number,
  })
  .views((self) => ({
    containsTeam(name) {
      return self.names.findIndex((n) => n === name) !== -1;
    },
  }));

export function templateFor(names, defaultSize, maximumSize) {
  return Template.create({
    names,
    defaultSize,
    maximumSize,
  });
}
