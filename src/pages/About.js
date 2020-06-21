import React from "react";
import { Rules } from "../components/Rules";

export default function About() {
  return (
    <>
      <section className="section">
        <div className="container">
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
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="columns">
            <div className="column is-two-thirds">
              <Rules />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
