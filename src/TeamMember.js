import React from "react";

export function TeamMember({ teamName, number }) {
  return (
    <span>
      {teamName}
      <sub>{number}</sub>
    </span>
  );
}

export function TeamMemberPlaceholder({ teamName, number }) {
  return (
    <span style={{ visibility: "hidden" }}>
      M<sub>9</sub>
    </span>
  );
}
