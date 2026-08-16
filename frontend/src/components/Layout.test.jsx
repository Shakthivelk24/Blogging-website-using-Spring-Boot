import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  MemoryRouter,
  Routes,
  Route,
} from "react-router-dom";

import Layout from "./Layout";


vi.mock("./Header", () => ({
  default: () => (
    <header data-testid="header">
      Header
    </header>
  ),
}));


describe("Layout Component", () => {

  test("renders Header", () => {

    render(
      <MemoryRouter initialEntries={["/"]}>

        <Routes>

          <Route
            path="/"
            element={<Layout />}
          />

        </Routes>

      </MemoryRouter>
    );


    expect(
      screen.getByTestId("header")
    ).toBeInTheDocument();

  });


  test("renders child route through Outlet", () => {

    render(
      <MemoryRouter initialEntries={["/child"]}>

        <Routes>

          <Route
            path="/"
            element={<Layout />}
          >

            <Route
              path="child"
              element={
                <div>
                  Child Page
                </div>
              }
            />

          </Route>

        </Routes>

      </MemoryRouter>
    );


    expect(
      screen.getByTestId("header")
    ).toBeInTheDocument();


    expect(
      screen.getByText("Child Page")
    ).toBeInTheDocument();

  });

});