import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

export function TeamMember({ teamName, number }) {
  return (
    <span style={{ whiteSpace: "nowrap" }}>
      <FontAwesomeIcon icon={faUser} />
      <sub>{teamName}</sub>
    </span>
  );
}

export function TeamMemberPlaceholder() {
  return (
    <span style={{ whiteSpace: "nowrap", visibility: "hidden" }}>
      <FontAwesomeIcon icon={faUser} />
      <sub>A</sub>
    </span>
  );
}
