import { types } from "mobx-state-tree";
import { GridSpec } from "./grid_spec";

export const AreaSpec = types
  .model("AreaSpec", {
    width: types.integer,
    height: types.integer,
  })
  .views((self) => ({
    toGridSpec() {
      return GridSpec.create({
        width: self.width,
        height: self.height,
        seats: [],
      });
    },
  }));
