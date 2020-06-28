import React from "react";
import { ApolloProvider } from "@apollo/react-hooks";
import ApolloClient from "apollo-boost";
import { InMemoryCache } from "apollo-cache-inmemory";
import {
  randomEasyProblem,
  randomHardProblem,
  randomProblemWithGridSize,
  parseProblemFrom,
} from "../model/problem";
import {} from "../model/problem.js";
import { loader } from "graphql.macro";

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
  function randomEasyLink() {
    const problem = randomEasyProblem();
    const path = `/play/${problem.grid.toVersion2Format()}/${problem.teams.toVersion1Format()}`;
    return { __typename: "ProblemLink", path, name: "Random Easy Game" };
  }
  function randomHardLink() {
    const problem = randomHardProblem();
    const path = `/play/${problem.grid.toVersion2Format()}/${problem.teams.toVersion1Format()}`;
    return { __typename: "ProblemLink", path, name: "Random Hard Game" };
  }
  const cache = new InMemoryCache();
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
          return [randomEasyLink(), randomHardLink()];
        },
        next: (_user, _args, _context, _info) => {
          const problem = randomEasyProblem();
          return {
            __typename: "ProblemSpec",
            gridSpec: problem.grid.toVersion2Format(),
            teamsSpec: problem.teams.toVersion1Format(),
          };
        },
      },
      Mutation: {
        problemCompleted: (_root, args, _context, _info) => {
          const {
            problemSpec: { gridSpec, teamsSpec },
          } = args;
          const completedProblem = parseProblemFrom(gridSpec, teamsSpec);
          const nextProblem = randomProblemWithGridSize(
            completedProblem.grid.width,
            completedProblem.grid.height
          );
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
