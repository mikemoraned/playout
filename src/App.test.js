import React from "react";
import ReactDOM from "react-dom";
import { observerBatching } from "mobx-react-lite";
import { render } from "@testing-library/react";
import App from "./App";

observerBatching(ReactDOM.unstable_batchedUpdates);

test("renders", () => {
  render(<App />);
});
