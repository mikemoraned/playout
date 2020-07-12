import React from "react";
import { useHistory, Link } from "react-router-dom";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faChessBoard } from "@fortawesome/free-solid-svg-icons";

function VisitGameButton({ path, name }) {
  const history = useHistory();

  function visitGame() {
    history.push(path);
  }

  return (
    <button className="button is-link is-light" onClick={() => visitGame()}>
      <span className="icon">
        <FontAwesomeIcon icon={faPlay} />
      </span>
      <span>{name}</span>
    </button>
  );
}

function Play() {
  const { loading, error, data } = useQuery(
    gql`
      query GetGameSuggestions {
        current_user @client {
          suggestions @client {
            name
            problemSpec {
              gridSpec
              teamsSpec
            }
          }
        }
      }
    `,
    {
      fetchPolicy: "no-cache",
    }
  );

  return (
    <>
      <h1 className="title">Play</h1>
      {!loading && !error && (
        <div className="buttons">
          {data.current_user.suggestions.map((s) => {
            const path = `/play/${s.problemSpec.gridSpec}/${s.problemSpec.teamsSpec}`;
            return <VisitGameButton key={path} path={path} name={s.grade} />;
          })}
        </div>
      )}
    </>
  );
}

function RecentlyCompleted() {
  const { loading, error, data } = useQuery(
    gql`
      query GetRecentlyCompleted {
        current_user @client {
          recentlyCompleted @client {
            grade
            problemSpec {
              gridSpec
              teamsSpec
            }
          }
        }
      }
    `
  );

  if (!loading && !error) {
    const recentlyCompleted = data.current_user.recentlyCompleted;
    if (recentlyCompleted.length > 0) {
      return (
        <section className="section">
          <div className="container">
            <h1 className="title is-4">Recently Completed</h1>
            {recentlyCompleted.map((gradedProblem, index) => {
              const { gridSpec, teamsSpec } = gradedProblem.problemSpec;
              const path = `/play/${gridSpec}/${teamsSpec}`;
              return (
                <article className="message is-link" key={index}>
                  <div className="message-body">
                    <VisitGameButton
                      path={path}
                      name={`${gradedProblem.grade} Game`}
                    />
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      );
    }
  }
  return <></>;
}

function Build() {
  return (
    <>
      <h1 className="title">Build</h1>
      <div className="buttons">
        <button className="button is-link is-light">
          <Link to="/build/5x5">
            <span className="icon">
              <FontAwesomeIcon icon={faChessBoard} />
            </span>
            <span>5 x 5</span>
          </Link>
        </button>
        <button className="button is-link is-light">
          <Link to="/build/10x10">
            <span className="icon">
              <FontAwesomeIcon icon={faChessBoard} />
            </span>
            <span>10 x 10</span>
          </Link>
        </button>
      </div>
    </>
  );
}

export default function Start() {
  return (
    <>
      <section className="hero is-medium is-primary is-bold">
        <div className="hero-body">
          <div className="container">
            <div className="columns">
              <div className="column">
                <Play />
              </div>
              <div className="column">
                <Build />
              </div>
            </div>
          </div>
        </div>
      </section>

      <RecentlyCompleted />
    </>
  );
}
