import React from "react";
import { Grid } from "../components/Grid";
import { TeamsFull } from "../components/TeamsFull";
import { StoreProvider } from "../model/contexts.js";
import { Biases } from "../components/Biases";
import { useContext } from "react";
import { StoreContext } from "../model/contexts.js";
import { useParams, Redirect, Link } from "react-router-dom";
import { Problem, defaultTeamsSpec } from "../model/problem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExternalLinkAlt,
  faBorderAll,
  faUserEdit,
  faStar,
  faSync,
  faHome,
  faChessBoard,
  faPlay,
  faDesktop,
} from "@fortawesome/free-solid-svg-icons";

import { observer } from "mobx-react";
import { parseAreaSpec } from "../model/grid/area_spec.format";
import { Breadcrumb } from "../components/Breadcrumb";
import "./Build.scss";

const BreadcrumbList = observer(() => {
  const { store } = useContext(StoreContext);
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
          <FontAwesomeIcon icon={faChessBoard} />
        </span>{" "}
        <span>
          Build {store.grid.width} x {store.grid.height}
        </span>
      </li>
    </ul>
  );
});

const BuildControls = observer(() => {
  const { store } = useContext(StoreContext);
  const problem = store.toProblem();
  const base = window.location.href;
  const path = `/play/${problem.grid.toVersion2Format()}/${problem.teams.toVersion1Format()}`;
  const fullURL = new URL(path, base);

  return (
    <div className={`box controls grade-${store.grade.name.toLowerCase()}`}>
      <div className="buttons">
        <button className="button" onClick={() => store.randomiseSeats()}>
          <span className="icon fa-layers fa-fw">
            <FontAwesomeIcon icon={faDesktop} />
            <FontAwesomeIcon
              icon={faSync}
              transform="shrink-8 down-10 right-10"
            />
          </span>
          <span>Randomise Seats</span>
        </button>
        <button
          className="button is-success"
          disabled={!store.solvable}
          onClick={() => {
            window.open(fullURL, "_blank");
          }}
        >
          <span className="icon fa-layers fa-fw">
            <FontAwesomeIcon icon={faPlay} />
            <FontAwesomeIcon
              icon={faExternalLinkAlt}
              transform="shrink-7 down-8 right-8"
            />
          </span>
          <span>Play</span>
          <span className="is-hidden-mobile">&nbsp;test in new tab</span>
        </button>
      </div>
    </div>
  );
});

const Instance = observer(() => {
  return (
    <>
      <Breadcrumb>
        <BreadcrumbList />
      </Breadcrumb>
      <div className="container">
        <div className="columns">
          <div className="column is-two-thirds">
            <section className="section">
              <h1 className="title is-4">Layout</h1>
              <p className="subtitle is-6">
                <span className="icon">
                  <FontAwesomeIcon icon={faBorderAll} />
                </span>{" "}
                Edit layout
              </p>
              <BuildControls />
              <Grid />
            </section>
          </div>
          <div className="column">
            <section className="section">
              <h1 className="title is-4">Teams</h1>
              <p className="subtitle is-6">
                <span className="icon">
                  <FontAwesomeIcon icon={faUserEdit} />
                </span>{" "}
                Edit Teams
              </p>
              <TeamsFull />
            </section>
            <section className="section">
              <h1 className="title is-4">Team preferences</h1>
              <p className="subtitle is-6">
                <span className="icon">
                  <FontAwesomeIcon icon={faStar} />
                </span>{" "}
                Edit preferences
              </p>
              <Biases />
            </section>
          </div>
        </div>
      </div>
    </>
  );
});

export default function Build() {
  const { areaSpec } = useParams();
  try {
    const gridSpec = parseAreaSpec(areaSpec).toGridSpec();
    const problemSpec = Problem.create({
      grid: gridSpec,
      teams: defaultTeamsSpec(),
    });

    const store = problemSpec.toStore();
    store.mode.setBuildMode();

    return (
      <StoreProvider initialStore={store}>
        <Instance />
      </StoreProvider>
    );
  } catch (e) {
    console.log(e);
    return <Redirect to="/" />;
  }
}
