import React, { useState, useContext } from "react";
import { Grid } from "../components/Grid";
import { TeamsMini } from "../components/TeamsMini";
import { TeamsFull } from "../components/TeamsFull";
import { Evaluation } from "../components/Evaluation";
import { StoreProvider } from "../model/contexts.js";
import { Biases } from "../components/Biases";
import { useParams, Redirect } from "react-router-dom";
import { parseProblemFrom } from "../model/problem";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBorderAll,
  faUser,
  faStar,
  faQuestionCircle,
  faArrowCircleRight,
  faWindowClose,
} from "@fortawesome/free-solid-svg-icons";
import { faStopCircle } from "@fortawesome/free-regular-svg-icons";
import Joyride, { STATUS } from "react-joyride";
import "./Play.scss";
import colors from "./Play.colors.scss";

export const TutorialContext = React.createContext(null);

export const TutorialProvider = ({ children }) => {
  const [showTutorial, setShowTutorial] = useState(false);
  return (
    <TutorialContext.Provider value={[showTutorial, setShowTutorial]}>
      {children}
    </TutorialContext.Provider>
  );
};

const TutorialTooltip = ({ step, tooltipProps, skipProps, primaryProps }) => {
  return (
    <div {...tooltipProps}>
      <article className="message is-info">
        <div className="message-header">
          <p>Step</p>

          <button className="button is-info" aria-label="delete" {...skipProps}>
            <span className="icon">
              <FontAwesomeIcon icon={faWindowClose} size="2x" />
            </span>
          </button>
        </div>
        <div className="message-body">
          <div className="content">{step.content}</div>
          <div>
            <div className="buttons is-right">
              <button className="button is-primary" {...primaryProps}>
                <span className="icon">
                  <FontAwesomeIcon icon={faArrowCircleRight} />
                </span>{" "}
                <span>Next</span>
              </button>
              <button className="button" {...skipProps}>
                <span className="icon">
                  <FontAwesomeIcon icon={faStopCircle} />
                </span>{" "}
                <span>Stop</span>
              </button>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

const TutorialButton = () => {
  const [showTutorial, setShowTutorial] = useContext(TutorialContext);
  return (
    <button
      className="button is-small is-info"
      onClick={() => setShowTutorial(true)}
      disabled={showTutorial}
    >
      <span className="icon">
        <FontAwesomeIcon icon={faQuestionCircle} />
      </span>{" "}
      <span>Tutorial</span>
    </button>
  );
};

const TutorialSetup = () => {
  const [showTutorial, setShowTutorial] = useContext(TutorialContext);
  const steps = [
    {
      target: ".grid .seat",
      content: "Place a Team Member by touching the Seat ...",
    },
    {
      target: ".evaluation .scoring",
      content: "... which increases your Score ...",
    },
    {
      target: ".tut-biases-explanation",
      content: "... by understanding team Biases",
    },

    {
      target: ".evaluation .completed",
      content: "Place all of your Team Members ...",
    },
    {
      target: ".evaluation .next",
      content: "... and move on to the next Game",
    },
  ];

  function handleJoyrideStatus(data) {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setShowTutorial(false);
    }
  }

  return (
    <Joyride
      steps={steps}
      run={showTutorial}
      spotlightClicks={true}
      continuous={true}
      callback={handleJoyrideStatus}
      tooltipComponent={TutorialTooltip}
      styles={{
        options: {
          arrowColor: colors.infocolor,
        },
      }}
    />
  );
};

const Instance = observer(() => {
  return (
    <TutorialProvider>
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
              <h1 className="title is-4">Teams</h1>
              <p className="subtitle is-6">
                <span className="icon">
                  <FontAwesomeIcon icon={faUser} />
                </span>
              </p>
              <TeamsFull />
            </section>
            <section className="section">
              <h1 className="title is-4">Biases</h1>
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
    </TutorialProvider>
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
