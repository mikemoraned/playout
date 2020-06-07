import { types } from "mobx-state-tree";
import { defaultTemplate } from "./template";
import { teamsFor } from "./teams";
import { teamFor } from "./team";
import { toV1Format } from "./team_spec.format";

export const BiasAssignmentSpec = types.model("BiasSpec", {
  from_name: types.string,
  to_name: types.string,
  bias_kind: types.string,
});

export const TeamSpec = types.model("TeamSpec", {
  name: types.string,
  size: types.number,
});

export const TeamsSpec = types
  .model("TeamsSpec", {
    teams: types.array(TeamSpec),
    biases: types.array(BiasAssignmentSpec),
  })
  .views((self) => ({
    toTeams() {
      const template = defaultTemplate();
      const teams = teamsFor(
        self.teams.map((t) => teamFor(t.name, t.size, template.maximumSize)),
        template
      );
      self.biases.forEach((b) => {
        teams.biases.setBias(b.from_name, b.to_name, b.bias_kind);
      });
      return teams;
    },
    toVersion1Format() {
      return toV1Format(self);
    },
  }));
