import React, { useState } from "react";
import { Logo } from "../components/Logo";
import "./Promo.scss";

function ToggleableLogo() {
  const [showLogo, setShowLogo] = useState(true);
  return (
    <div className="logo" onClick={() => setShowLogo(!showLogo)}>
      <span style={{ visibility: showLogo ? "visible" : "hidden" }}>
        <Logo fontSize="125px" />
      </span>
    </div>
  );
}

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
      <ToggleableLogo />
    </div>
  );
}
