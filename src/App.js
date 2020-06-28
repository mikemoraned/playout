import React, { Suspense, lazy } from "react";
import "./App.scss";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import { version } from "../package.json";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useParams,
} from "react-router-dom";
import { defaultTeamsSpec } from "./model/problem";
import { GraphQLProvider } from "./model/contexts";

const Build = lazy(() => import("./pages/Build"));
const Play = lazy(() => import("./pages/Play"));
const About = lazy(() => import("./pages/About"));
const Start = lazy(() => import("./pages/Start"));

function App() {
  return (
    <div className="App">
      <GraphQLProvider>
        <Router>
          <Navigation version={version} />
          <Suspense fallback={<div></div>}>
            <Switch>
              <Route path="/about">
                <About />
              </Route>
              <Route path="/play/:gridSpec/:teamsSpec">
                <Play />
              </Route>
              <Route path="/play/:gridSpec">
                <FallbackWhenTeamSpecMissing />
              </Route>
              <Route path="/play">
                <Redirect to="/" />;
              </Route>
              <Route path="/build/:areaSpec">
                <Build />
              </Route>
              <Route path="/build/">
                <FallbackWhenAreaSpecMissing />
              </Route>
              <Route path="/">
                <Start />
              </Route>
            </Switch>
          </Suspense>
          <Footer />
        </Router>
      </GraphQLProvider>
    </div>
  );
}

function FallbackWhenTeamSpecMissing() {
  const { gridSpec } = useParams();
  const fallbackTeamsSpec = defaultTeamsSpec().toVersion1Format();
  return <Redirect to={`/play/${gridSpec}/${fallbackTeamsSpec}`} />;
}

function FallbackWhenAreaSpecMissing() {
  return <Redirect to="/build/10x10" />;
}

export default App;
