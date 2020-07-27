import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/pro-duotone-svg-icons";
import { faSmile } from "@fortawesome/pro-regular-svg-icons";

export function Logo({ fontSize, style }) {
  return (
    <span
      style={{
        ...style,
        font: `small-caps bold ${fontSize} monospace`,
      }}
    >
      P L{" "}
      <span className="icon is-small">
        <FontAwesomeIcon icon={faUser} size="xs" />
      </span>{" "}
      Y{" "}
      <span className="icon is-small">
        <FontAwesomeIcon icon={faSmile} size="xs" />
      </span>{" "}
      U T
    </span>
  );
}
