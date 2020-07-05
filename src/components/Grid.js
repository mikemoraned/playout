import React from "react";
import { useContext } from "react";
import { observer } from "mobx-react";
import { TeamMember, TeamMemberPlaceholder } from "./TeamMember";
import { StoreContext } from "../model/contexts.js";
import { positionFor } from "../model/grid/grid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDesktop } from "@fortawesome/free-solid-svg-icons";
import "./Grid.scss";

function Desktop({ visibility }) {
  return (
    <span
      className="icon is-small"
      style={{
        visibility,
      }}
    >
      <FontAwesomeIcon icon={faDesktop} />
    </span>
  );
}

export const Grid = observer(() => {
  const { store } = useContext(StoreContext);
  const { width, height } = store.grid;
  return (
    <div className="grid table-container">
      <table width={"100%"} className="table" style={{ tableLayout: "fixed" }}>
        <tbody>
          {[...Array(height).keys()].map((y) => {
            return (
              <tr key={y}>
                {[...Array(width).keys()].map((x) => {
                  const position = positionFor(x, y);
                  const has_seat = store.grid.hasSeat(position);
                  const occupancy = store.grid.findOccupancy(position);
                  const cornerAdjacencies = adjacencies(store, x, y);
                  return (
                    <td
                      className={`${
                        has_seat ? "has-background-info" : ""
                      } ${cornerAdjacencies}`}
                      onClick={() => store.togglePosition(position)}
                      key={x}
                      style={{
                        textAlign: "center",
                        // border: "1px solid black",
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
                        {!has_seat && <Desktop visibility={"hidden"} />}
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

function adjacencies(store, x, y) {
  function adjacencyCode(x, y) {
    return store.grid.hasSeat(positionFor(x, y)) ? "o" : "e";
  }

  // the "clock" starts to left of current seat, not
  // at top as a normal clock would
  const clockwiseAdjacencyCodes = [
    adjacencyCode(x - 1, y),
    adjacencyCode(x - 1, y - 1),
    adjacencyCode(x, y - 1),
    adjacencyCode(x + 1, y - 1),
    adjacencyCode(x + 1, y),
    adjacencyCode(x + 1, y + 1),
    adjacencyCode(x, y + 1),
    adjacencyCode(x - 1, y + 1),
  ];

  const topLeftCorner = [
    clockwiseAdjacencyCodes[0],
    clockwiseAdjacencyCodes[1],
    clockwiseAdjacencyCodes[2],
  ].join("");

  const topRightCorner = [
    clockwiseAdjacencyCodes[2],
    clockwiseAdjacencyCodes[3],
    clockwiseAdjacencyCodes[4],
  ].join("");

  const bottomRightCorner = [
    clockwiseAdjacencyCodes[4],
    clockwiseAdjacencyCodes[5],
    clockwiseAdjacencyCodes[6],
  ].join("");

  const bottomLeftCorner = [
    clockwiseAdjacencyCodes[6],
    clockwiseAdjacencyCodes[7],
    clockwiseAdjacencyCodes[0],
  ].join("");

  return `tl-${topLeftCorner} tr-${topRightCorner} br-${bottomRightCorner} bl-${bottomLeftCorner}`;
}
