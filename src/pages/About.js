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
        <section className="section">
          <div className="columns">
            <div className="column is-two-thirds">
              <h2 className="title">Privacy</h2>
              <div className="content">
                <p>
                  <em>No tracking of individual users is done.</em>
                </p>
                <p>
                  This site is a Single Page App which keeps all data about you
                  locally, including your preferences.
                </p>
                <p>
                  All Game generation and remembering of completed Games is done
                  locally. This may change in the future to include recording
                  when a level is completed and with what score, and to allow
                  richer Games to be generated server-side. However, even then,
                  this will be done anonymously.
                </p>
                <p>
                  Tracking of anonymised statistics is done, including which
                  paths are visited and which countries people are from. This is
                  done via{" "}
                  <a href="https://www.netlify.com/products/analytics/">
                    Netlify server-side log Analytics
                  </a>{" "}
                  and client-side via{" "}
                  <a href="https://plausible.io/data-policy">Plausible.io</a>{" "}
                  tracking. Neither of these track individual statistics about
                  users but do record enough to allow an approximation of unique
                  user counts.
                </p>
                <p>
                  You can share your completed games to both Facebook and
                  Twitter. However, the client-side SDKs for both of these are{" "}
                  <em>not used</em>. A shareable link is generated instead. This
                  means that information about you cannot accidentally be leaked
                  as a side-effect of loading some Javascript on this site.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
