import React from "react";
import { useContext } from "react";
import { observer } from "mobx-react";
import { TeamMember, TeamMemberPlaceholder } from "./TeamMember";
import { MobXStoreContext } from "./model/store.js";
import { positionFor } from "./model/grid";

function Desktop({ visibility }) {
  return (
    <span
      className="icon is-small"
      style={{
        visibility,
      }}
    >
      <i className="fas fa-desktop"></i>
    </span>
  );
}

export const Grid = observer(() => {
  const { store } = useContext(MobXStoreContext);
  const { width, height } = store.grid;
  return (
    <div className="table-container">
      <table width={"100%"} className="table" style={{ tableLayout: "fixed" }}>
        <tbody>
          {[...Array(height).keys()].map((y) => {
            return (
              <tr key={y}>
                {[...Array(width).keys()].map((x) => {
                  const position = positionFor(x, y);
                  const has_seat = store.grid.hasSeat(position);
                  const occupancy = store.grid.findOccupancy(position);
                  return (
                    <td
                      className={`${has_seat ? "has-background-info" : ""}`}
                      onClick={() => store.toggleMemberPlacement(position)}
                      key={x}
                      style={{
                        textAlign: "center",
                        border: "1px solid black",
                      }}
                    >
                      <span className="is-hidden-mobile">
                        <Desktop visibility={has_seat ? "visible" : "hidden"} />{" "}
                        {occupancy && (
                          <TeamMember
                            teamName={occupancy.member.team}
                            number={occupancy.member.index + 1}
                          />
                        )}
                        {!occupancy && <TeamMemberPlaceholder />}
                      </span>
                      <span className="is-hidden-tablet">
                        {has_seat && !occupancy && (
                          <Desktop visibility={"visible"} />
                        )}
                        {occupancy && (
                          <TeamMember
                            teamName={occupancy.member.team}
                            number={occupancy.member.index + 1}
                          />
                        )}
                      </span>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
});
