import React from "react";
import "./App.scss";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import { version } from "../package.json";
import { Build } from "./pages/Build";
import { About } from "./pages/About";
import { Start } from "./pages/Start";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Navigation version={version} />
        <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/play/:gridSpec">
            <Build />
          </Route>
          <Route path="/play">
            <Redirect to="/" />;
          </Route>
          <Route path="/">
            <Start />
          </Route>
        </Switch>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
