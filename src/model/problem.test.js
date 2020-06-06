import { parseProblemFrom, Problem, randomGridSpec } from "./problem";
import { GridSpec } from "./grid/grid_spec";
import { getSnapshot } from "mobx-state-tree";

describe("v1 problem parsing", () => {
  test("can successfully parse valid v1 grid spec", () => {
    const validExample = "2x2.~.~_v1";
    const problem = getSnapshot(parseProblemFrom(validExample));
    expect(problem.grid.width).toEqual(2);
    expect(problem.grid.height).toEqual(2);
    expect(problem.grid.seats).toEqual(["1_0", "1_1"]);
  });

  describe("generic format errors", () => {
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

    test("non-integer size causes error", () => {
      const invalidExample = "2x1.2.~.~..~~_v1";
      expect(() => {
        parseProblemFrom(invalidExample);
      }).toThrowError(/^invalid spec: incorrect format$/);
    });
  });

  describe("v1 format errors", () => {
    test("missing space indicator causes error", () => {
      const invalidExample = "2x2_v1";
      expect(() => {
        parseProblemFrom(invalidExample);
      }).toThrowError(/^invalid spec: incorrect format$/);
    });

    test("invalid space char causes error", () => {
      const invalidExample = "2x2_~.~..~~_v1";
      expect(() => {
        parseProblemFrom(invalidExample);
      }).toThrowError(/^invalid spec: incorrect format$/);
    });
  });

  describe("v2 format errors", () => {
    test("missing separator causes error", () => {
      const invalidExample = "2x2UA--v2";
      expect(() => {
        parseProblemFrom(invalidExample);
      }).toThrowError(/^invalid spec: incorrect format$/);
    });

    test("invalid base64 space char causes error", () => {
      const invalidExample = "2x2_UA==v2";
      expect(() => {
        parseProblemFrom(invalidExample);
      }).toThrowError(/^invalid spec: incorrect format$/);
    });
  });

  describe("semantic errors", () => {
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

    test("v1: mis-matched size causes error", () => {
      const invalidExample = "2x2.~....~~_v1";
      expect(() => {
        parseProblemFrom(invalidExample);
      }).toThrowError(/^invalid spec: expected 4 seat indicators$/);
    });

    test("v2: invalid base64", () => {
      const invalidExample = "2x2_A--v2";
      expect(() => {
        parseProblemFrom(invalidExample);
      }).toThrowError(/^invalid spec: cannot decode from base64$/);
    });

    test("v2: mis-matched size causes error", () => {
      const invalidExample = "4x4_UA--v2";
      expect(() => {
        parseProblemFrom(invalidExample);
      }).toThrowError(/^invalid spec: expected 16 seat indicators$/);
    });
  });

  describe("limits", () => {
    test("example at limit is accepted", () => {
      let seatString = "";
      let remaining = 100 * 100;
      while (remaining-- !== 0) {
        seatString += "~";
      }
      const validExample = `100x100${seatString}_v1`;
      const problem = getSnapshot(parseProblemFrom(validExample));
      expect(problem.grid.width).toEqual(100);
      expect(problem.grid.height).toEqual(100);
      expect(problem.grid.seats.length).toEqual(100 * 100);
    });

    test("too large area causes error", () => {
      let seatString = "";
      let remaining = 100 * 101;
      while (remaining-- !== 0) {
        seatString += "~";
      }
      const invalidExample = `100x101${seatString}_v1`;
      expect(() => {
        parseProblemFrom(invalidExample);
      }).toThrowError(
        /^invalid spec: width \* height too large, must be <= 10000$/
      );
    });
  });
});

describe("v2 problem parsing", () => {
  test("can successfully parse valid v2 grid spec", () => {
    const validExample = "2x2_UA--v2";
    const problem = getSnapshot(parseProblemFrom(validExample));
    expect(problem.grid.width).toEqual(2);
    expect(problem.grid.height).toEqual(2);
    expect(problem.grid.seats).toEqual(["1_0", "1_1"]);
  });

  test("can successfully get some seats for valid v2 large grid spec", () => {
    const validExample = "10x10_eVI6u5zS.fdlf5R0QA--v2";
    const problem = getSnapshot(parseProblemFrom(validExample));
    expect(problem.grid.width).toEqual(10);
    expect(problem.grid.height).toEqual(10);
    expect(problem.grid.seats.length).toBeGreaterThan(0);
  });
});

describe("large example parsing", () => {
  const validV1Example = (
    "10x10" +
    // 0123456789
    "  .~.~~..~.~" + // 0
    "  .~~.~~...~" + // 1
    "  .....~~~.~" + // 2
    "  ...~~~...." + // 3
    "  ~~~~..~..~" + // 4
    "  .~...~~.~." + // 5
    "  .~~~~~.~~." + // 6
    "  .~.~.....~" + // 7
    "  ~..~~.~.~." + // 8
    "  ...~..~~.." + // 9
    "_v1"
  ).replace(/ /g, "");

  // validV1Example -> 0101100101011011000100000111010001110000111100100101000110100111110110010100000110011010100001001100
  // -> 01011001,01011011,00010000,01110100,01110000,11110010,01010001,10100111,11011001,01000001,10011010,10000100,1100 + 0000
  // -> Y[\u0010tpòQ§ÙA\u009a\u0084À
  // -> WVsQdHDyUafZQZqEwA==
  // -> WVsQdHDyUafZQZqEwA--
  const validV2Example = "10x10_WVsQdHDyUafZQZqEwA--v2";

  const seats = [
    "1_0",
    "3_0",
    "4_0",
    "7_0",
    "9_0",
    "1_1",
    "2_1",
    "4_1",
    "5_1",
    "9_1",
    "5_2",
    "6_2",
    "7_2",
    "9_2",
    "3_3",
    "4_3",
    "5_3",
    "0_4",
    "1_4",
    "2_4",
    "3_4",
    "6_4",
    "9_4",
    "1_5",
    "5_5",
    "6_5",
    "8_5",
    "1_6",
    "2_6",
    "3_6",
    "4_6",
    "5_6",
    "7_6",
    "8_6",
    "1_7",
    "3_7",
    "9_7",
    "0_8",
    "3_8",
    "4_8",
    "6_8",
    "8_8",
    "3_9",
    "6_9",
    "7_9",
  ];

  test("can successfully parse valid v1 grid spec", () => {
    const problem = getSnapshot(parseProblemFrom(validV1Example));
    expect(problem.grid.width).toEqual(10);
    expect(problem.grid.height).toEqual(10);
    expect(problem.grid.seats).toEqual(seats);
  });

  test("can successfully create valid v1 grid spec", () => {
    const problem = GridSpec.create({
      width: 10,
      height: 10,
      seats,
    });
    const formatted = problem.toVersion1Format();
    expect(formatted).toEqual(validV1Example);
  });

  test("can successfully parse valid v2 grid spec", () => {
    const problem = getSnapshot(parseProblemFrom(validV2Example));
    expect(problem.grid.width).toEqual(10);
    expect(problem.grid.height).toEqual(10);
    expect(problem.grid.seats).toEqual(seats);
  });

  test("can successfully create valid v2 grid spec", () => {
    const problem = GridSpec.create({
      width: 10,
      height: 10,
      seats,
    });
    const formatted = problem.toVersion2Format();
    expect(formatted).toEqual(validV2Example);
  });
});

// 10x10.~.~~..~.~.~~.~~...~.....~~~.~...~~~....~~~~..~..~.~...~~.~..~~~~~.~~..~.~.....~~..~~.~.~....~..~~.._v1

describe("random examples", () => {
  const original = randomGridSpec(10, 10);

  test("can roundtrip via v1 grid spec", () => {
    const formatted = original.toVersion1Format();
    const roundtripped = parseProblemFrom(formatted);
    const expectedSeats = [...getSnapshot(roundtripped.grid.seats)];
    expectedSeats.sort();
    const actualSeats = [...getSnapshot(original.seats)];
    actualSeats.sort();

    expect(roundtripped.grid.width).toEqual(10);
    expect(roundtripped.grid.height).toEqual(10);
    expect(expectedSeats).toEqual(actualSeats);
  });

  test("can roundtrip via v2 grid spec", () => {
    const formatted = original.toVersion2Format();
    const roundtripped = parseProblemFrom(formatted);
    const expectedSeats = [...getSnapshot(roundtripped.grid.seats)];
    expectedSeats.sort();
    const actualSeats = [...getSnapshot(original.seats)];
    actualSeats.sort();

    expect(roundtripped.grid.width).toEqual(10);
    expect(roundtripped.grid.height).toEqual(10);
    expect(expectedSeats).toEqual(actualSeats);
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

  test("can create valid v2 grid spec", () => {
    const gridSpec = GridSpec.create({
      width: 2,
      height: 2,
      seats: ["1_0", "1_1"],
    });

    // .~.~ -> 0101 binary -> 01010000 padded binary -> 80 int char code -> "P" string -> "UA==" base64 -> "UA--" url-safe

    const expected = "2x2_UA--v2";
    expect(gridSpec.toVersion2Format()).toEqual(expected);
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
