import React, { useContext } from "react";
import { TutorialContext } from "../model/contexts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandsHelping } from "@fortawesome/free-solid-svg-icons";

export default function Settings() {
  const {
    explainedEasy,
    setExplainedEasy,
    explainedMedium,
    setExplainedMedium,
    explainedHard,
    setExplainedHard,
  } = useContext(TutorialContext);
  console.log(explainedEasy, explainedMedium, explainedHard);
  return (
    <>
      <section className="section">
        <div className="container">
          <div className="columns">
            <div className="column is-two-thirds">
              <h1 className="title">Settings</h1>
              <div className="field">
                <div className="control">
                  <label className="checkbox is-size-5">
                    <FontAwesomeIcon icon={faHandsHelping} />{" "}
                    <input
                      type="checkbox"
                      checked={explainedEasy}
                      onChange={() => setExplainedEasy(!explainedEasy)}
                    />{" "}
                    "Easy" level has been explained
                  </label>
                </div>
                <div className="control">
                  <label className="checkbox is-size-5">
                    <FontAwesomeIcon icon={faHandsHelping} />{" "}
                    <input
                      type="checkbox"
                      checked={explainedMedium}
                      onChange={() => setExplainedMedium(!explainedMedium)}
                    />{" "}
                    "Medium" level has been explained
                  </label>
                </div>
                <div className="control">
                  <label className="checkbox is-size-5">
                    <FontAwesomeIcon icon={faHandsHelping} />{" "}
                    <input
                      type="checkbox"
                      checked={explainedHard}
                      onChange={() => setExplainedHard(!explainedHard)}
                    />{" "}
                    "Hard" level has been explained
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
