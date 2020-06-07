import { types } from "mobx-state-tree";
import { toV1Format } from "./grid_spec.format.v1";
import { toV2Format } from "./grid_spec.format.v2";

export const GridSpec = types
  .model("GridSpec", {
    width: types.integer,
    height: types.integer,
    seats: types.array(types.string),
  })
  .views((self) => {
    return {
      toVersion1Format() {
        return toV1Format(self);
      },
      toVersion2Format() {
        return toV2Format(self);
      },
    };
  });
