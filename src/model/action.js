export function togglePlaceMemberAction(position) {
  return {
    type: "toggle_place_member",
    position,
    undoable: true,
  };
}

export function selectTeamAction(name) {
  return {
    type: "select_team",
    name,
  };
}

export function addTeamAction() {
  return { type: "add_team" };
}

export function addTeamMemberAction(name) {
  return { type: "add_team_member", name };
}

export function rotateBiasAction(fromTeamName, toTeamName) {
  return {
    type: "rotate_bias",
    fromTeamName,
    toTeamName,
  };
}

export function undoAction() {
  return { type: "undo" };
}

export function chainActions(reducer, state, actions) {
  if (actions.length === 0) {
    return state;
  } else {
    const [first, rest] = [actions[0], actions.slice(1)];
    return chainActions(reducer, reducer(state, first), rest);
  }
}
