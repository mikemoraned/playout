import React from "react";
import { useHistory } from "react-router-dom";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { faGameBoard } from "@fortawesome/pro-regular-svg-icons";
import {
  faTwitter,
  faTwitterSquare,
  faFacebook,
  faFacebookSquare,
} from "@fortawesome/free-brands-svg-icons";
import "./Start.scss";

function VisitGameButton({ path, grade, name }) {
  const history = useHistory();

  function visitGame() {
    history.push(path);
  }

  return (
    <button
      className={`button grade grade-${grade.toLowerCase()}`}
      onClick={() => visitGame()}
    >
      <span className="icon">
        <FontAwesomeIcon icon={faPlay} swapOpacity />
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
            grade
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
            return (
              <VisitGameButton
                key={path}
                path={path}
                grade={s.grade}
                name={s.grade}
              />
            );
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
            score
            problem {
              grade
              problemSpec {
                gridSpec
                teamsSpec
              }
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
            {recentlyCompleted.map((completedProblem, index) => {
              const {
                gridSpec,
                teamsSpec,
              } = completedProblem.problem.problemSpec;
              const path = `/play/${gridSpec}/${teamsSpec}`;
              return (
                <article className="message is-link" key={index}>
                  <div className="message-body">
                    <div className="buttons">
                      <VisitGameButton
                        path={path}
                        grade={completedProblem.problem.grade}
                        name={`${completedProblem.problem.grade} Game`}
                      />
                      <TwitterShareButton
                        path={path}
                        score={completedProblem.score}
                        grade={completedProblem.problem.grade}
                      />
                      <FacebookShareButton path={path} />
                    </div>
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

function TwitterShareButton({ path, score, grade }) {
  const twitterBlue = "#1DA1F2";
  const problemLink = `https://playoutgame.app${path}`;
  const tweetText = `I scored ${score} on ${grade} level of @playoutgame ${problemLink}`.replace(
    " ",
    "%20"
  );
  const shareLink = `https://twitter.com/intent/tweet?text=${tweetText}`;
  return (
    <>
      <button
        className="button is-hidden-mobile"
        style={{ backgroundColor: twitterBlue, color: "white" }}
        onClick={() => window.open(shareLink, "_blank")}
      >
        <span className="icon">
          <FontAwesomeIcon icon={faTwitter} />
        </span>

        <span className="is-hidden-mobile">Share</span>
      </button>
      <button
        className="button is-hidden-tablet"
        style={{ backgroundColor: "transparent", borderColor: "transparent" }}
        onClick={() => window.open(shareLink, "_blank")}
      >
        <span
          className="icon"
          style={{ backgroundColor: "white", color: twitterBlue }}
        >
          <FontAwesomeIcon icon={faTwitterSquare} size="3x" />
        </span>
      </button>
    </>
  );
}

function FacebookShareButton({ path }) {
  const facebookBlue = "#4267B2";
  const problemLink = `https://playoutgame.app${path}`;
  const encodedHref = encodeURIComponent(problemLink);
  const shareLink = `https://www.facebook.com/dialog/share?app_id=3263552610376375&display=popup&href=${encodedHref}`;
  return (
    <>
      <button
        className="button is-hidden-mobile"
        style={{ backgroundColor: facebookBlue, color: "white" }}
        onClick={() => window.open(shareLink, "_blank")}
      >
        <span className="icon">
          <FontAwesomeIcon icon={faFacebook} />
        </span>
        <span className="is-hidden-mobile">Share</span>
      </button>
      <button
        className="button is-hidden-tablet"
        style={{ backgroundColor: "transparent", borderColor: "transparent" }}
        onClick={() => window.open(shareLink, "_blank")}
      >
        <span
          className="icon"
          style={{ backgroundColor: "white", color: facebookBlue }}
        >
          <FontAwesomeIcon icon={faFacebookSquare} size="3x" />
        </span>
      </button>
    </>
  );
}

function Build() {
  const history = useHistory();
  return (
    <>
      <h1 className="title">Build</h1>
      <div className="buttons">
        <button
          className="button is-link is-light"
          onClick={() => history.push("/build/5x5")}
        >
          <span className="icon">
            <FontAwesomeIcon icon={faGameBoard} swapOpacity />
          </span>
          <span>5 x 5</span>
        </button>
        <button
          className="button is-link is-light"
          onClick={() => history.push("/build/10x10")}
        >
          <span className="icon">
            <FontAwesomeIcon icon={faGameBoard} swapOpacity />
          </span>
          <span>10 x 10</span>
        </button>
      </div>
    </>
  );
}

export default function Start() {
  return (
    <>
      <section className="hero is-medium">
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
