import React from "react";
import { screen } from "@testing-library/react";
import App from "../src/App";
import { renderWithProviders } from "./test-utils";

test("renders navbar title", () => {
  renderWithProviders(<App />);
  expect(screen.getByText(/electronics shop/i)).toBeInTheDocument();
});
