import React from "react";
import { useContext } from "react";
import { observer } from "mobx-react";
import { TeamMember, TeamMemberPlaceholder } from "./TeamMember";
import { StoreContext } from "../model/contexts.js";
import { positionFor } from "../model/grid/grid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSeedling } from "@fortawesome/free-solid-svg-icons";
import { faSquareFull } from "@fortawesome/pro-light-svg-icons";
import { faDesktop } from "@fortawesome/pro-light-svg-icons";
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

function Plant() {
  return (
    <span className="icon is-small plant-pot fa-layers">
      <FontAwesomeIcon
        icon={faSquareFull}
        transform="left-1 down-5"
        className="pot"
      />
      <FontAwesomeIcon
        icon={faSeedling}
        transform="shrink-2 rotate--15 left-3 up-6"
        className="plant"
      />
      <FontAwesomeIcon
        icon={faSeedling}
        transform="shrink-2 rotate-15 right-3"
        swapOpacity
        className="plant"
      />
      <FontAwesomeIcon
        icon={faSeedling}
        transform="shrink-2 rotate--15 left-3 down-5"
        className="plant"
      />
      <FontAwesomeIcon
        icon={faSeedling}
        transform="shrink-2 rotate-15 right-3 down-5"
        className="plant"
      />
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
                  const hasPlant = store.grid.hasDecoration(position);
                  const cornerAdjacencies = adjacencies(store, x, y);
                  return (
                    <td
                      className={`${has_seat ? "has-background-info" : ""} ${
                        has_seat ? "seat" : ""
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
                        {hasPlant && <Plant />}
                      </span>
                      <span className="is-hidden-tablet">
                        {has_seat && !occupancy && (
                          <Desktop visibility={"visible"} />
                        )}
                        {!has_seat && !hasPlant && (
                          <Desktop visibility={"hidden"} />
                        )}
                        {hasPlant && <Plant />}
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
  function occupancyCode(x, y) {
    return store.grid.hasSeat(positionFor(x, y)) ? "o" : "e";
  }

  // the "clock" starts to left of current seat, not
  // at top as a normal clock would
  const clockwiseOccupancyCodes = [
    occupancyCode(x - 1, y),
    occupancyCode(x - 1, y - 1),
    occupancyCode(x, y - 1),
    occupancyCode(x + 1, y - 1),
    occupancyCode(x + 1, y),
    occupancyCode(x + 1, y + 1),
    occupancyCode(x, y + 1),
    occupancyCode(x - 1, y + 1),
  ];

  const topLeftCorner = [
    clockwiseOccupancyCodes[0],
    clockwiseOccupancyCodes[1],
    clockwiseOccupancyCodes[2],
  ].join("");

  const topRightCorner = [
    clockwiseOccupancyCodes[2],
    clockwiseOccupancyCodes[3],
    clockwiseOccupancyCodes[4],
  ].join("");

  const bottomRightCorner = [
    clockwiseOccupancyCodes[4],
    clockwiseOccupancyCodes[5],
    clockwiseOccupancyCodes[6],
  ].join("");

  const bottomLeftCorner = [
    clockwiseOccupancyCodes[6],
    clockwiseOccupancyCodes[7],
    clockwiseOccupancyCodes[0],
  ].join("");

  return `tl-${topLeftCorner} tr-${topRightCorner} br-${bottomRightCorner} bl-${bottomLeftCorner}`;
}
