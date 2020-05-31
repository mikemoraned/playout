import { parseProblemFrom, Problem, GridSpec } from "./problem";
import { getSnapshot } from "mobx-state-tree";

describe("problem parsing", () => {
  test("can successfully parse valid v1 grid spec", () => {
    const validExample = "2x2.~.~_v1";
    const problem = getSnapshot(parseProblemFrom(validExample));
    expect(problem.grid.width).toEqual(2);
    expect(problem.grid.height).toEqual(2);
    expect(problem.grid.seats).toEqual(["1_0", "1_1"]);
  });

  test("undefined causes error", () => {
    expect(() => {
      parseProblemFrom(undefined);
    }).toThrowError(/^missing spec$/);
  });

  test("null causes error", () => {
    expect(() => {
      parseProblemFrom(null);
    }).toThrowError(/^missing spec$/);
  });

  test("missing version causes error", () => {
    const invalidExample = "2x2.~.~..~~";
    expect(() => {
      parseProblemFrom(invalidExample);
    }).toThrowError(/^invalid spec: incorrect format$/);
  });

  test("missing size causes error", () => {
    const invalidExample = ".~.~..~~_v1";
    expect(() => {
      parseProblemFrom(invalidExample);
    }).toThrowError(/^invalid spec: incorrect format$/);
  });

  test("missing space indicator causes error", () => {
    const invalidExample = "2x2_v1";
    expect(() => {
      parseProblemFrom(invalidExample);
    }).toThrowError(/^invalid spec: incorrect format$/);
  });

  test("non-integer size causes error", () => {
    const invalidExample = "2x1.2.~.~..~~_v1";
    expect(() => {
      parseProblemFrom(invalidExample);
    }).toThrowError(/^invalid spec: incorrect format$/);
  });

  test("zero as a width causes error", () => {
    const invalidExample = `0x2.~.~..~~_v1`;
    expect(() => {
      parseProblemFrom(invalidExample);
    }).toThrowError(/^invalid spec: dimensions cannot be zero$/);
  });

  test("zero as a height causes error", () => {
    const invalidExample = `2x0.~.~..~~_v1`;
    expect(() => {
      parseProblemFrom(invalidExample);
    }).toThrowError(/^invalid spec: dimensions cannot be zero$/);
  });

  test("mis-matched size causes error", () => {
    const invalidExample = "2x2.~....~~_v1";
    expect(() => {
      parseProblemFrom(invalidExample);
    }).toThrowError(/^invalid spec: expected 4 seat indicators$/);
  });

  test("invalid space char causes error", () => {
    const invalidExample = "2x2_~.~..~~_v1";
    expect(() => {
      parseProblemFrom(invalidExample);
    }).toThrowError(/^invalid spec: incorrect format$/);
  });
});

describe("problem spec generation", () => {
  test("can create valid v1 grid spec", () => {
    const gridSpec = GridSpec.create({
      width: 2,
      height: 2,
      seats: ["1_0", "1_1"],
    });
    const expected = "2x2.~.~_v1";
    expect(gridSpec.toVersion1Format()).toEqual(expected);
  });
});

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
