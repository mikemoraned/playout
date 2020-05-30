import React from "react";
import "./App.scss";
import { Navigation } from "./components/Navigation";
import { version } from "../package.json";
import { Build } from "./pages/Build";
import { About } from "./pages/About";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Navigation version={version} />
        <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/">
            <Build />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
