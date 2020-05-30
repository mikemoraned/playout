import React from "react";

export function Logo({ fontSize }) {
  return (
    <span
      style={{
        marginLeft: "0.5em",
        font: `small-caps bold ${fontSize} monospace`,
      }}
    >
      P L{" "}
      <span className="icon is-small">
        <i className="far fa-user fa-xs"></i>
      </span>{" "}
      Y{" "}
      <span className="icon is-small">
        <i className={`far fa-smile fa-xs`}></i>
      </span>{" "}
      U T
    </span>
  );
}
