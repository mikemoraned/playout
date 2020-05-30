import React from "react";

export function About() {
  return (
    <>
      <section class="section">
        <div className="container">
          <div className="columns">
            <div className="column is-two-thirds">
              <h1 class="title">About</h1>
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
      <section class="section">
        <div className="container">
          <div className="columns">
            <div className="column is-two-thirds">
              <h1 class="title">The Rules for Happiness</h1>
              <div className="content">
                <dl>
                  <dt>Place all of the Teams</dt>
                  <dd>It doesn't count unless everyone has a seat.</dd>

                  <dt>Keep each team together</dt>
                  <dd>
                    Team Members like to be next to at least one other
                    team-mate.
                  </dd>

                  <dt>Cater for Biases</dt>
                  <dd>Some Teams want to be next to other Teams.</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
