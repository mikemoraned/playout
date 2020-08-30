import React from "react";
import { useContext } from "react";
import { observer } from "mobx-react";
import { StoreContext } from "../model/contexts.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey } from "@fortawesome/pro-light-svg-icons";

export const HintToggle = observer(() => {
  const { store } = useContext(StoreContext);

  return (
    <button
      className={`hint-control button is-small ${
        store.showOpportunities ? "is-success" : "is-info"
      }`}
      onClick={() => store.toggleShowOpportunities()}
      disabled={!store.showOpportunitiesPossible}
    >
      <span className="icon">
        <FontAwesomeIcon icon={faKey} />
      </span>{" "}
      <span>Hints</span>
    </button>
  );
});
