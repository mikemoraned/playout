import React from "react";
import { useContext, useState } from "react";
import { observer } from "mobx-react";
import { useHistory } from "react-router-dom";
import { StoreContext } from "../model/contexts.js";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

const PROBLEM_COMPLETED = gql`
  mutation ProblemCompleted($width: Int!, $height: Int!) {
    next: problemCompleted(width: $width, height: $height) @client {
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
    const { width, height } = problem.grid;
    setTimeout(() => {
      problemCompleted({ variables: { width, height } });
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
          <i className="fas fa-angle-double-right"></i>
        </span>
      </button>
      <button
        className={`button is-hidden-tablet ${isLoading ? "is-loading" : ""}`}
        disabled={!complete}
        onClick={() => startLoading()}
      >
        <span className="icon">
          <i className="fas fa-angle-double-right fa-2x"></i>
        </span>
      </button>
    </>
  );
});
