import React, { Suspense, lazy } from "react";
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
import { TutorialProvider } from "./model/contexts.js";
import { defaultTeamsSpec } from "./model/problem";
import { GraphQLProvider } from "./model/contexts";
import Start from "./pages/Start";
import "./App.scss";

const deferred = [];
function defer(fn) {
  deferred.push(fn);
  return lazy(fn);
}
function triggerDeferred() {
  console.log("Triggering deferred");
  deferred.forEach((fn, index) => {
    console.log("Triggering", index);
    fn();
  });
}
window.addEventListener("load", () => {
  triggerDeferred();
});

const Play = defer(() => import(/* webpackChunkName: "Play" */ "./pages/Play"));
const Build = defer(() =>
  import(/* webpackChunkName: "Build" */ "./pages/Build")
);
const About = defer(() =>
  import(/* webpackChunkName: "About" */ "./pages/About")
);
const Settings = defer(() =>
  import(/* webpackChunkName: "Settings" */ "./pages/Settings")
);
const Promo = defer(() =>
  import(/* webpackChunkName: "Promo" */ "./pages/Promo")
);
const RandomGrid = defer(() =>
  import(/* webpackChunkName: "RandomGrid" */ "./pages/RandomGrid")
);

function App() {
  return (
    <div className="App">
      <GraphQLProvider>
        <TutorialProvider>
          <Router>
            <Suspense fallback={<div></div>}>
              <Switch>
                <Route path="/promo/random">
                  <RandomGrid />
                </Route>
                <Route path="/promo">
                  <Promo />
                </Route>
                <Route path="/about">
                  <Wrapped>
                    <About />
                  </Wrapped>
                </Route>
                <Route path="/play/:gridSpec/:teamsSpec">
                  <Wrapped>
                    <Play />
                  </Wrapped>
                </Route>
                <Route path="/play/:gridSpec">
                  <FallbackWhenTeamSpecMissing />
                </Route>
                <Route path="/play">
                  <Redirect to="/" />;
                </Route>
                <Route path="/build/:areaSpec">
                  <Wrapped>
                    <Build />
                  </Wrapped>
                </Route>
                <Route path="/build/">
                  <FallbackWhenAreaSpecMissing />
                </Route>
                <Route path="/settings">
                  <Wrapped>
                    <Settings />
                  </Wrapped>
                </Route>
                <Route path="/">
                  <Wrapped>
                    <Start />
                  </Wrapped>
                </Route>
              </Switch>
            </Suspense>
          </Router>
        </TutorialProvider>
      </GraphQLProvider>
    </div>
  );
}

function Wrapped({ children }) {
  return (
    <>
      <Navigation version={version} />
      {children}
      <Footer />
    </>
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
