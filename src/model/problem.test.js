import { Problem } from "./problem";
import { GridSpec } from "./grid/grid_spec";

describe("conversion to/from store", () => {
  test("can convert into a Store", () => {
    const problem = Problem.create({
      grid: GridSpec.create({
        width: 2,
        height: 2,
        seats: ["1_1", "1_1"],
      }),
    });
    const store = problem.toStore();
    expect(store.grid.width).toEqual(2);
    expect(store.grid.height).toEqual(2);
    expect(store.grid.seats).toEqual(["1_1", "1_1"]);
  });
});
