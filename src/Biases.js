import React, { useState } from "react";

const preferenceChoices = [
  "fas fa-user-slash",
  "",
  "fas fa-user-friends fa-lg",
  "fas fa-users fa-lg",
];

function Preference({ initialChoiceIndex }) {
  const [choiceIndex, setChoiceIndex] = useState(initialChoiceIndex);
  const choice = preferenceChoices[choiceIndex];
  const next = () => {
    setChoiceIndex((choiceIndex + 1) % preferenceChoices.length);
  };
  return (
    <button className="button is-small" onClick={() => next()}>
      <span className="icon">
        <i className={`${choice}`}></i>
      </span>
    </button>
  );
}

function randomChoiceIndex() {
  return Math.floor(Math.random() * 0.99 * preferenceChoices.length);
}

function Self() {
  return (
    <span className="icon has-text-grey-light">
      <i className="fas fa-slash fa-sm"></i>
    </span>
  );
}

function randomBiases(teams) {
  const biases = {};
  for (let fromIndex = 0; fromIndex < teams.length; fromIndex++) {
    for (let toIndex = 0; toIndex < teams.length; toIndex++) {
      const key = `${fromIndex}.${toIndex}`;
      if (fromIndex === toIndex) {
        biases[key] = -1;
      } else {
        biases[key] = randomChoiceIndex();
      }
    }
  }
  return biases;
}

export function Biases() {
  const teams = ["A", "B", "C", "D", "E"];
  const [biases] = useState(randomBiases(teams));
  return (
    <table className="table is-narrow" style={{ tableLayout: "fixed" }}>
      <thead>
        <tr>
          <th colSpan={teams.length + 1}>Proximity:</th>
        </tr>
        <tr>
          <th>from:</th>
          {teams.map((t) => {
            return <th key={t}>{t}</th>;
          })}
        </tr>
      </thead>
      <tbody>
        {teams.map((t, toIndex) => {
          return (
            <tr key={t}>
              <td>to {t}:</td>
              {teams.map((_, fromIndex) => {
                const key = `${fromIndex}.${toIndex}`;
                const initialChoiceIndex = biases[key];
                if (initialChoiceIndex === -1) {
                  return (
                    <td key={key}>
                      <Self />
                    </td>
                  );
                } else {
                  return (
                    <td key={key}>
                      <Preference initialChoiceIndex={initialChoiceIndex} />
                    </td>
                  );
                }
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
