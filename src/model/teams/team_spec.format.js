import { InvalidProblemSpec } from "../invalid_problem_spec";
import { TeamsSpec, TeamSpec, BiasAssignmentSpec } from "./teams_spec";
import { BiasKind } from "./bias";

const V1_REGEX = new RegExp("(.+)_(.*)_v1");

export function parseTeamsSpec(s, template) {
  if (s === null || s === undefined) {
    throw new InvalidProblemSpec("missing spec");
  }
  const v1Match = s.match(V1_REGEX);
  if (v1Match === null) {
    throw new InvalidProblemSpec("invalid spec: incorrect format");
  }
  const teams = parseTeamSpec(v1Match[1], template);
  const biases = parseBiasAssignmentSpec(v1Match[2], teams);

  return TeamsSpec.create({
    teams,
    biases,
  });
}

const V1_TEAM_PATTERN = "([A-Z])(\\d+)";

function parseTeamSpec(s, template) {
  const teamsRegex = new RegExp("^(" + V1_TEAM_PATTERN + ")+$");
  if (s.match(teamsRegex) === null) {
    throw new InvalidProblemSpec("invalid spec: incorrect format");
  }
  const teams = [];
  const teamRegex = new RegExp(V1_TEAM_PATTERN, "y");
  let match = teamRegex.exec(s);
  while (match !== null) {
    const name = match[1];
    if (!template.containsTeam(name)) {
      throw new InvalidProblemSpec(
        "invalid spec: team not allowed by template"
      );
    }
    const size = parseInt(match[2]);
    if (size === 0) {
      throw new InvalidProblemSpec("invalid spec: team size cannot be zero");
    }
    if (size > template.maximumSize) {
      throw new InvalidProblemSpec("invalid spec: team size too big");
    }
    teams.push(
      TeamSpec.create({
        name,
        size,
      })
    );
    match = teamRegex.exec(s);
  }
  return teams;
}

const V1_BIAS_ASSIGNMENT_PATTERN = "([A-Z])([A-Z])(nt|nb)";

export const biasKindShortcutMap = {
  nb: BiasKind.NO_BIAS,
  nt: BiasKind.NEXT_TO,
};

function parseBiasAssignmentSpec(s, teams) {
  const biases = [];
  const biasAssignmentRegex = new RegExp(V1_BIAS_ASSIGNMENT_PATTERN, "y");
  let match = biasAssignmentRegex.exec(s);
  while (match !== null) {
    const from_name = match[1];
    const to_name = match[2];
    if (!containsTeam(teams, from_name) || !containsTeam(teams, to_name)) {
      throw new InvalidProblemSpec("invalid spec: team for assignment missing");
    }
    biases.push(
      BiasAssignmentSpec.create({
        from_name,
        to_name,
        bias_kind: biasKindShortcutMap[match[3]],
      })
    );
    match = biasAssignmentRegex.exec(s);
  }
  return biases;
}

function containsTeam(teams, name) {
  return teams.findIndex((t) => t.name === name) !== -1;
}
