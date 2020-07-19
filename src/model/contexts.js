import React, { useState, useEffect } from "react";
import { ApolloProvider } from "@apollo/react-hooks";
import ApolloClient from "apollo-boost";
import { InMemoryCache } from "apollo-cache-inmemory";
import { parseProblemFrom } from "./problem";
import { Grade, gradeFromProblemSpec } from "./grade";
import { loader } from "graphql.macro";
import { gql } from "apollo-boost";

const SETTING_PREFIX = "v1_";
function useSetting(key, booleanDefaultValue) {
  const fullKey = `${SETTING_PREFIX}${key}`;
  const [state, setState] = React.useState(
    () => JSON.parse(localStorage.getItem(fullKey)) || booleanDefaultValue
  );
  useEffect(() => {
    localStorage.setItem(fullKey, JSON.stringify(state));
  }, [fullKey, state]);
  return [state, setState];
}

export const TutorialContext = React.createContext(null);

export const TutorialProvider = ({ children }) => {
  const [showTutorial, setShowTutorial] = useState(false);
  const [explainedEasy, setExplainedEasy] = useSetting("explainedEasy", false);
  const [explainedMedium, setExplainedMedium] = useSetting(
    "explainedMedium",
    false
  );
  const [explainedHard, setExplainedHard] = useSetting("explainedHard", false);
  return (
    <TutorialContext.Provider
      value={{
        showTutorial,
        setShowTutorial,
        explainedEasy,
        setExplainedEasy,
        explainedMedium,
        setExplainedMedium,
        explainedHard,
        setExplainedHard,
      }}
    >
      {children}
    </TutorialContext.Provider>
  );
};

export const StoreContext = React.createContext(null);

export const StoreProvider = ({ initialStore, children }) => {
  return (
    <StoreContext.Provider value={{ store: initialStore }}>
      {children}
    </StoreContext.Provider>
  );
};

export const GraphQLProvider = ({ children }) => {
  const typeDefs = loader("./types.graphql");
  function gradedProblem(name) {
    const grade = Grade.create({ name });
    const problemSpec = grade.randomProblemSpec();
    return {
      __typename: "GradeProblem",
      grade: name,
      problemSpec: {
        __typename: "ProblemSpec",
        gridSpec: problemSpec.grid.toVersion2Format(),
        teamsSpec: problemSpec.teams.toVersion1Format(),
      },
    };
  }
  const cache = new InMemoryCache();
  cache.writeData({
    data: {
      current_user: {
        __typename: "User",
        recentlyCompleted: [],
      },
    },
  });
  const client = new ApolloClient({
    cache,
    resolvers: {
      Query: {
        current_user: (_root, _args, _context, _info) => {
          return {
            __typename: "User",
          };
        },
      },
      User: {
        suggestions: (_user, _args, _context, _info) => {
          return [
            gradedProblem("Easy"),
            gradedProblem("Medium"),
            gradedProblem("Hard"),
          ];
        },
      },
      Mutation: {
        problemCompleted: (_root, args, context, _info) => {
          const {
            problemSpec: { gridSpec, teamsSpec },
          } = args;
          const completedProblem = parseProblemFrom(gridSpec, teamsSpec);
          const grade = gradeFromProblemSpec(completedProblem);

          const { cache } = context;
          const query = gql`
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
          `;
          const previousData = cache.readQuery({ query });
          const nextData = {
            current_user: {
              __typename: "User",
              recentlyCompleted: [
                {
                  __typename: "GradedProblem",
                  grade: grade.name,
                  problemSpec: {
                    __typename: "ProblemSpec",
                    gridSpec,
                    teamsSpec,
                  },
                },
              ].concat(previousData.current_user.recentlyCompleted),
            },
          };
          cache.writeQuery({ query, data: nextData });

          const nextProblem = grade.randomProblemSpec();
          return {
            __typename: "ProblemSpec",
            gridSpec: nextProblem.grid.toVersion2Format(),
            teamsSpec: nextProblem.teams.toVersion1Format(),
          };
        },
      },
    },
    typeDefs,
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
