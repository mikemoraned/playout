import React from "react";
import "./App.scss";
import { Navigation } from "./components/Navigation";
import { version } from "../package.json";
import { Build } from "./pages/Build";

function App() {
  return (
    <div className="App">
      <Navigation version={version} />
      <Build />
    </div>
  );
}

export default App;
