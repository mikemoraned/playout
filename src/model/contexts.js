import React from "react";
import { useLocalStore } from "mobx-react";
import { ApolloProvider } from "@apollo/react-hooks";
import ApolloClient from "apollo-boost";
import { InMemoryCache } from "apollo-cache-inmemory";
import { gql } from "apollo-boost";
import { randomEasyProblem, randomHardProblem } from "../model/problem";

export const StoreContext = React.createContext(null);

export const StoreProvider = ({ initialStore, children }) => {
  const mobXStore = useLocalStore(() => initialStore);

  return (
    <StoreContext.Provider value={{ store: mobXStore }}>
      {children}
    </StoreContext.Provider>
  );
};

export const GraphQLProvider = ({ children }) => {
  const typeDefs = gql`
    type Query {
      suggestions: [GameLink]
    }

    type GameLink {
      path: String
      name: String
    }
  `;
  function randomEasyLink() {
    const problem = randomEasyProblem();
    const path = `/play/${problem.grid.toVersion2Format()}/${problem.teams.toVersion1Format()}`;
    return { __typename: "GameLink", path, name: "Random Easy Game" };
  }
  function randomHardLink() {
    const problem = randomHardProblem();
    const path = `/play/${problem.grid.toVersion2Format()}/${problem.teams.toVersion1Format()}`;
    return { __typename: "GameLink", path, name: "Random Hard Game" };
  }
  const cache = new InMemoryCache();
  const client = new ApolloClient({
    cache,
    resolvers: {
      Query: {
        suggestions: (_root, _args, _context, _info) => {
          return [randomEasyLink(), randomHardLink()];
        },
      },
    },
    typeDefs,
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
