import React from "react";
import { useContext } from "react";
import { positionFor, StoreContext, togglePlaceMemberAction } from "./store.js";

export function Grid() {
  const { state, dispatch } = useContext(StoreContext);
  const { width, height, seats, occupied } = state.grid;
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
                      onClick={() =>
                        dispatch(togglePlaceMemberAction(position))
                      }
                      key={key}
                      style={{
                        textAlign: "center",
                        border: "1px solid black",
                      }}
                    >
                      <span
                        className="icon is-hidden-mobile"
                        style={{
                          visibility: `${has_seat ? "visible" : "hidden"}`,
                        }}
                      >
                        <i className="fas fa-desktop"></i>
                      </span>
                      {occupancy && (
                        <span>
                          {occupancy.member.team}
                          <sub>{occupancy.member.index + 1}</sub>
                        </span>
                      )}
                      {!occupancy && (
                        <span style={{ visibility: "hidden" }}>
                          A<sub>1</sub>
                        </span>
                      )}
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
