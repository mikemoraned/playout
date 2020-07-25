import React from "react";
import { Rules } from "../components/Rules";
import { faHome, faInfoCircle } from "@fortawesome/pro-duotone-svg-icons";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
          <FontAwesomeIcon icon={faInfoCircle} />
        </span>{" "}
        <span>About</span>
      </li>
    </ul>
  );
};

export default function About() {
  return (
    <>
      <Breadcrumb>
        <BreadcrumbList />
      </Breadcrumb>
      <div className="container">
        <section className="section">
          <div className="columns">
            <div className="column is-two-thirds">
              <h1 className="title">About</h1>
              <div className="content">
                <p>
                  Playout is a game born during the times of Covid, when the
                  idea of working from an office was like something out of Myth.
                </p>

                <p>
                  It's also a way for me to explore the domain of placement and,
                  on the smaller scale, put together a modern minimal React App.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="section">
          <div className="columns">
            <div className="column is-two-thirds">
              <Rules />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
