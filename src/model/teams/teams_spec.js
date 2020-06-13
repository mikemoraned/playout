import { types } from "mobx-state-tree";
import { defaultTemplate } from "./template";
import { teamsFor } from "./teams";
import { teamFor } from "./team";
import { toV1Format } from "./team_spec.format";
import { TeamSpec } from "./team_spec";
import { BiasAssignmentSpec } from "./bias_assignment_spec";

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
