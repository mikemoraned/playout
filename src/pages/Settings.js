import React, { useContext } from "react";
import { TutorialContext } from "../model/contexts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHandsHelping,
  faHome,
  faUserCog,
} from "@fortawesome/pro-duotone-svg-icons";
import { Link } from "react-router-dom";
import { Breadcrumb } from "../components/Breadcrumb";

const BreadcrumbList = () => {
  return (
    <ul>
      <li>
        <Link to={"/"}>
          <span className="icon">
            <FontAwesomeIcon icon={faHome} />
          </span>{" "}
          <span>Home</span>
        </Link>
      </li>
      <li className="is-active">
        <span className="icon">
          <FontAwesomeIcon icon={faUserCog} />
        </span>{" "}
        <span>Settings</span>
      </li>
    </ul>
  );
};

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
      <Breadcrumb>
        <BreadcrumbList />
      </Breadcrumb>
      <div className="container">
        <section className="section">
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
        </section>
      </div>
    </>
  );
}
