import React from "react";
import { Logo } from "./Logo";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopyright } from "@fortawesome/pro-light-svg-icons";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="columns">
          <div className="column is-two-thirds">
            <div className="content has-text-centered">
              <p>
                <Link to="/about">
                  <Logo fontSize="20px" />
                </Link>{" "}
                is{" "}
                <span className="icon is-small">
                  <FontAwesomeIcon icon={faCopyright} />
                </span>{" "}
                2020 by <a href="https://houseofmoran.com/">Mike Moran</a>. The
                source code is licensed under{" "}
                <a href="https://github.com/mikemoraned/playout/blob/master/LICENSE">
                  Apache 2.0
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
