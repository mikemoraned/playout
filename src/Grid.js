import React from "react";
import { useContext } from "react";
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

export function Grid() {
  const { store } = useContext(MobXStoreContext);
  const { width, height, seats, occupied } = store.grid;
  return (
    <div className="table-container">
      <table width={"100%"} className="table" style={{ tableLayout: "fixed" }}>
        <tbody>
          {[...Array(height).keys()].map((y) => {
            return (
              <tr key={y}>
                {[...Array(width).keys()].map((x) => {
                  const key = `${x}_${y}`;
                  const position = positionFor(x, y);
                  const has_seat = seats.indexOf(position) !== -1;
                  const occupancy = occupied.find(
                    (o) => o.position === position
                  );
                  return (
                    <td
                      className={`${has_seat ? "has-background-info" : ""}`}
                      onClick={() => store.toggleMemberPlacement(position)}
                      key={key}
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
}
