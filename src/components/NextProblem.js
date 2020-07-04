import React from "react";
import { useContext, useState } from "react";
import { observer } from "mobx-react";
import { useHistory } from "react-router-dom";
import { StoreContext } from "../model/contexts.js";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleRight } from "@fortawesome/free-solid-svg-icons";

const PROBLEM_COMPLETED = gql`
  mutation ProblemCompleted($problemSpec: ProblemSpec) {
    next: problemCompleted(problemSpec: $problemSpec) @client {
      gridSpec
      teamsSpec
    }
  }
`;

export const NextProblem = observer(() => {
  const history = useHistory();
  const [problemCompleted] = useMutation(PROBLEM_COMPLETED, {
    onCompleted: onLoaded,
  });
  const [isLoading, setLoading] = useState(false);
  const { store } = useContext(StoreContext);
  const { progress } = store.evaluation;
  const complete = progress.value === progress.max;
  const fakeDelay = 500;

  function startLoading() {
    setLoading(true);
    const problem = store.toProblem();
    const problemSpec = {
      gridSpec: problem.grid.toVersion2Format(),
      teamsSpec: problem.teams.toVersion1Format(),
    };
    setTimeout(() => {
      problemCompleted({
        variables: {
          problemSpec,
        },
      });
    }, fakeDelay);
  }

  function onLoaded(data) {
    const {
      next: { gridSpec, teamsSpec },
    } = data;

    const path = `/play/${gridSpec}/${teamsSpec}`;
    setLoading(false);
    history.push(path);
  }

  return (
    <>
      <button
        className={`button is-hidden-mobile ${isLoading ? "is-loading" : ""}`}
        disabled={!complete}
        onClick={() => startLoading()}
      >
        <span>Next</span>
        <span className="icon">
          <FontAwesomeIcon icon={faAngleDoubleRight} />
        </span>
      </button>
      <button
        className={`button is-hidden-tablet ${isLoading ? "is-loading" : ""}`}
        disabled={!complete}
        onClick={() => startLoading()}
      >
        <span className="icon">
          <FontAwesomeIcon icon={faAngleDoubleRight} size="2x" />
        </span>
      </button>
    </>
  );
});
