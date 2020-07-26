import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faQuestionCircle,
  faArrowCircleRight,
  faWindowClose,
  faBan,
} from "@fortawesome/pro-duotone-svg-icons";
import { faStopCircle } from "@fortawesome/pro-duotone-svg-icons";
import Joyride, { STATUS } from "react-joyride";
import { TutorialContext, StoreContext } from "../model/contexts.js";
import colors from "./Tutorial.colors.scss";
import "./Tutorial.scss";
import { observer } from "mobx-react";

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
  const { showTutorial, setShowTutorial } = useContext(TutorialContext);
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
  const { showTutorial, setShowTutorial } = useContext(TutorialContext);
  const steps = [
    {
      target: ".grid .seat",
      content: "Place a Team Member by clicking on the Seat.",
    },
    {
      target: ".tut-biases-explanation",
      content: "Satisfy your Teams Preferences \u2026",
    },
    {
      target: ".evaluation .scoring",
      content: "\u2026 to maximise your overall Score.",
    },
    {
      target: ".evaluation .completed",
      content: "Once you've placed all of your Team Members \u2026",
    },
    {
      target: ".evaluation .next",
      content: "\u2026 you can move on to the next Game.",
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

export const TutorialGradeIntro = observer(() => {
  const { store } = useContext(StoreContext);
  const {
    showTutorial,
    setShowTutorial,
    explainedEasy,
    setExplainedEasy,
    explainedMedium,
    setExplainedMedium,
    explainedHard,
    setExplainedHard,
  } = useContext(TutorialContext);

  function onClose(tutorialWanted) {
    if (store.grade.name === "Easy") {
      setExplainedEasy(true);
    }
    if (store.grade.name === "Medium") {
      setExplainedMedium(true);
    }
    if (store.grade.name === "Hard") {
      setExplainedHard(true);
    }
    setShowTutorial(tutorialWanted);
  }

  const needToExplain =
    (store.grade.name === "Easy" && !explainedEasy) ||
    (store.grade.name === "Medium" && !explainedMedium) ||
    (store.grade.name === "Hard" && !explainedHard);

  return (
    needToExplain &&
    !showTutorial && <TutorialGradeIntroModal closeCallback={onClose} />
  );
});

export const TutorialGradeIntroModal = observer(({ closeCallback }) => {
  const { store } = useContext(StoreContext);
  const explanations = {
    Easy: <div>Welcome to Easy level.</div>,
    Medium: (
      <div>
        Welcome to Medium level. You may see smaller offices or complicated Team
        Preferences.
      </div>
    ),
    Hard: (
      <div>
        Welcome to Hard level. You'll see small offices and complicated Team
        Preferences.
      </div>
    ),
  };

  return (
    <div
      className={`grade-intro grade-${store.grade.name.toLowerCase()} modal is-active has-text-justified`}
    >
      <div className="modal-background"></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">{store.grade.name} level</p>
          <button
            className="delete"
            aria-label="close"
            onClick={() => closeCallback(true)}
          ></button>
        </header>
        <section className="modal-card-body">
          <div className="content">{explanations[store.grade.name]}</div>
          <div className="buttons are-small is-right">
            <button
              className="button is-info"
              onClick={() => closeCallback(true)}
            >
              <span className="icon">
                <FontAwesomeIcon icon={faArrowCircleRight} />
              </span>{" "}
              <span>Tutorial</span>
            </button>
            <button className="button" onClick={() => closeCallback(false)}>
              <span className="icon">
                <FontAwesomeIcon icon={faBan} />
              </span>{" "}
              <span>Skip</span>
            </button>
          </div>
        </section>
        <footer className="modal-card-foot"></footer>
      </div>
    </div>
  );
});
