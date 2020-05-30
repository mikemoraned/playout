import React from "react";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="columns">
          <div className="column is-two-thirds">
            <div className="content has-text-centered">
              <p>
                <Logo fontSize="20px" /> is{" "}
                <span className="icon is-small">
                  <i class="far fa-copyright"></i>
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
