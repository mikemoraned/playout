import { biasesFor, expandBiases } from "./bias";

export function memberFor(teamName, index) {
  return {
    id: `${teamName}_${index}`,
    team: teamName,
    index,
  };
}

export function teamFor(name, size) {
  const placed = new Array(size);
  for (let index = 0; index < placed.length; index++) {
    placed[index] = false;
  }
  return {
    name,
    next: 0,
    placed,
    remaining: size,
    canAdd: true,
  };
}

export function templateFor(names, defaultSize, maximumSize) {
  return {
    names,
    defaultSize,
    maximumSize,
  };
}

export function teamsFor(teams, template) {
  return {
    list: teams,
    next: teams[0].name,
    template,
    canAdd: true,
    biases: biasesFor(teams),
  };
}

export function teamWithMemberPlaced(team, member) {
  const placed = [...team.placed];
  placed[member.index] = true;
  const next = placed.findIndex((taken) => !taken);

  return {
    ...team,
    placed,
    next,
    remaining: team.remaining - 1,
  };
}

export function teamWithMemberReturned(team, member) {
  const placed = [...team.placed];
  placed[member.index] = false;
  const next = placed.findIndex((taken) => !taken);

  return {
    ...team,
    placed,
    next,
    remaining: team.remaining + 1,
  };
}

export function addNewTeamFromTemplate(teams) {
  const remaining = teams.template.names.filter((n) => {
    return teams.list.findIndex((t) => t.name === n) === -1;
  });
  const newList = teams.list.concat([
    teamFor(remaining[0], teams.template.defaultSize),
  ]);
  return {
    ...teams,
    list: newList,
    canAdd: remaining.length > 1,
    biases: expandBiases(teams.biases, newList),
  };
}

export function addTeamMember(teams, name) {
  const team = teams.list.find((t) => t.name === name);
  if (team.placed.length === teams.template.maximumSize) {
    throw new Error("cannot add team member");
  }
  const placed = team.placed.concat([false]);
  return {
    ...team,
    placed,
    remaining: team.remaining + 1,
    canAdd: placed.length < teams.template.maximumSize,
  };
}

export function teamListWithReplacedTeam(list, team) {
  return list.map((t) => {
    if (t.name === team.name) {
      return team;
    } else {
      return t;
    }
  });
}
