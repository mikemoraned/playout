import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faQuestionCircle,
  faArrowCircleRight,
  faWindowClose,
} from "@fortawesome/free-solid-svg-icons";
import { faStopCircle } from "@fortawesome/free-regular-svg-icons";
import Joyride, { STATUS } from "react-joyride";
import { TutorialContext } from "../model/contexts.js";
import colors from "./Tutorial.colors.scss";

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

export const TutorialButton = () => {
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

export const TutorialSetup = () => {
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
