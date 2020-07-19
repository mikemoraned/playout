import React from "react";
import { Grid } from "../components/Grid";
import { TeamsMini } from "../components/TeamsMini";
import { Evaluation } from "../components/Evaluation";
import { StoreProvider } from "../model/contexts.js";
import { Biases } from "../components/Biases";
import {
  TutorialButton,
  TutorialSetup,
  TutorialGradeIntro,
} from "../components/Tutorial";
import { useParams, Redirect } from "react-router-dom";
import { parseProblemFrom } from "../model/problem";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBorderAll, faStar } from "@fortawesome/free-solid-svg-icons";
import "./Play.scss";

const Instance = observer(() => {
  return (
    <>
      <TutorialGradeIntro />
      <div className="container">
        <TutorialSetup />
        <div className="mt-3 sticky-evaluation">
          <Evaluation />
        </div>
        <div className="columns">
          <div className="column is-two-thirds">
            <section className="section">
              <h1 className="title is-4">Layout</h1>
              <p className="subtitle is-6">
                <span className="icon">
                  <FontAwesomeIcon icon={faBorderAll} />
                </span>{" "}
                <span>
                  Place Team Members in Seats <TutorialButton />
                </span>
              </p>
              <TeamsMini />
              <Grid />
            </section>
          </div>
          <div className="column">
            <section className="section">
              <h1 className="title is-4">Team preferences</h1>
              <p className="subtitle is-6">
                <span className="icon">
                  <FontAwesomeIcon icon={faStar} />
                </span>{" "}
                Who wants what?
              </p>
              <Biases />
            </section>
          </div>
        </div>
      </div>
    </>
  );
});

export default function Play() {
  const { gridSpec, teamsSpec } = useParams();

  try {
    const problem = parseProblemFrom(gridSpec, teamsSpec);
    const store = problem.toStore();
    store.mode.setPlayMode();

    return (
      <StoreProvider initialStore={store}>
        <Instance />
      </StoreProvider>
    );
  } catch (e) {
    console.log(e);
    return <Redirect to="/" />;
  }
}
