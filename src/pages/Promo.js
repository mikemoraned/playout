import React from "react";
import { Logo } from "../components/Logo";
import "./Promo.scss";

export default function Promo() {
  const tileWidth = 4;
  const tileHeight = 2;
  const tileBorder = 1;
  const rowIds = [...Array(tileBorder + tileHeight + tileBorder).keys()];
  return (
    <div className="promo">
      <div className="background">
        <div className="examples">
          {rowIds.map((rowId) => {
            const colIds = [
              ...Array(tileBorder + tileWidth + tileBorder).keys(),
            ];
            return (
              <div key={rowId}>
                <div key={rowId}>
                  {colIds.map((colId) => {
                    const id = `${rowId}_${colId}`;
                    return (
                      <iframe
                        src="/promo/random"
                        title={`embedded_${id}`}
                        key={id}
                      />
                    );
                  })}
                </div>
                <br />
              </div>
            );
          })}
        </div>
      </div>
      <div className="logo">
        <Logo fontSize="50px" />
      </div>
    </div>
  );
}
