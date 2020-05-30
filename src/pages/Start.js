import React from "react";
import { useHistory } from "react-router-dom";
import { randomGridSpec } from "../model/problem";

export function Start() {
  const history = useHistory();

  function visitRandomGameLink() {
    const gridSpec = randomGridSpec(10, 10);
    const path = `/play/${gridSpec.toVersion1Format()}`;
    history.push(path);
  }
  return (
    <>
      <section className="hero is-medium is-primary is-bold">
        <div className="hero-body">
          <div className="container">
            <h1 className="title">Start</h1>
            <p>
              <button className="button" onClick={() => visitRandomGameLink()}>
                Play Random
              </button>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
