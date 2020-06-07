import { TeamsSpec, TeamSpec, BiasAssignmentSpec } from "./teams_spec";
import { parseTeamsSpec } from "./team_spec.format";
import { BiasKind } from "./bias";
import { Template } from "./template";

describe("v1 team spec parsing", () => {
  const template = Template.create({
    names: ["A", "B", "C"],
    defaultSize: 1,
    maximumSize: 3,
  });

  test("can successfully parse with 'next to' bias", () => {
    const validExample = "A1B3_ABnt_v1";
    const expected = TeamsSpec.create({
      teams: [
        TeamSpec.create({ name: "A", size: 1 }),
        TeamSpec.create({ name: "B", size: 3 }),
      ],
      biases: [
        BiasAssignmentSpec.create({
          from_name: "A",
          to_name: "B",
          bias_kind: BiasKind.NEXT_TO,
        }),
      ],
    });
    const teamsSpec = parseTeamsSpec(validExample, template);
    expect(teamsSpec).toEqual(expected);
  });

  test("can successfully parse with 'no bias' bias", () => {
    const validExample = "A1B3_ABnb_v1";
    const expected = TeamsSpec.create({
      teams: [
        TeamSpec.create({ name: "A", size: 1 }),
        TeamSpec.create({ name: "B", size: 3 }),
      ],
      biases: [
        BiasAssignmentSpec.create({
          from_name: "A",
          to_name: "B",
          bias_kind: BiasKind.NO_BIAS,
        }),
      ],
    });
    const teamsSpec = parseTeamsSpec(validExample, template);
    expect(teamsSpec).toEqual(expected);
  });

  test("can successfully parse with no biases", () => {
    const validExample = "A1B3__v1";
    const expected = TeamsSpec.create({
      teams: [
        TeamSpec.create({ name: "A", size: 1 }),
        TeamSpec.create({ name: "B", size: 3 }),
      ],
      biases: [],
    });
    const teamsSpec = parseTeamsSpec(validExample, template);
    expect(teamsSpec).toEqual(expected);
  });

  describe("generic format errors", () => {
    test("undefined causes error", () => {
      expect(() => {
        parseTeamsSpec(undefined, template);
      }).toThrowError(/^missing spec$/);
    });

    test("null causes error", () => {
      expect(() => {
        parseTeamsSpec(null, template);
      }).toThrowError(/^missing spec$/);
    });

    test("missing version causes error", () => {
      const invalidExample = "A1B3_ABnt";
      expect(() => {
        parseTeamsSpec(invalidExample, template);
      }).toThrowError(/^invalid spec: incorrect format$/);
    });

    test("missing teams causes error", () => {
      const invalidExample = "_ABnt_v1";
      expect(() => {
        parseTeamsSpec(invalidExample, template);
      }).toThrowError(/^invalid spec: incorrect format$/);
    });

    test("non-integer team size causes error", () => {
      const invalidExample = "A1.3B3_ABnt_v1";
      expect(() => {
        parseTeamsSpec(invalidExample, template);
      }).toThrowError(/^invalid spec: incorrect format$/);
    });

    test("uses unknown bias shortcode", () => {
      const invalidExample = "A1.3B3_ABff_v1";
      expect(() => {
        parseTeamsSpec(invalidExample, template);
      }).toThrowError(/^invalid spec: incorrect format$/);
    });
  });

  describe("semantic errors", () => {
    test("zero as a team size causes error", () => {
      const invalidExample = "A1B0_ABnt_v1";
      expect(() => {
        parseTeamsSpec(invalidExample, template);
      }).toThrowError(/^invalid spec: team size cannot be zero$/);
    });

    test("bias assignment for missing team causes error", () => {
      const invalidExample = "A1B3_ACnt_v1";
      expect(() => {
        parseTeamsSpec(invalidExample, template);
      }).toThrowError(/^invalid spec: team for assignment missing$/);
    });

    test("uses team not in template", () => {
      const invalidExample = "A1D3_ADnt_v1";
      expect(() => {
        parseTeamsSpec(invalidExample, template);
      }).toThrowError(/^invalid spec: team not allowed by template$/);
    });

    test("uses team with size bigger than alloweed by template", () => {
      const invalidExample = "A1B4_ABnt_v1";
      expect(() => {
        parseTeamsSpec(invalidExample, template);
      }).toThrowError(/^invalid spec: team size too big$/);
    });
  });
});
