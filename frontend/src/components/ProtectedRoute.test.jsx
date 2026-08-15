import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import { userDataContext } from "../context/DataContext.jsx";


const renderProtectedRoute = ({
  userData = null,
  loadingUser = false,
  children = <div>Protected Content</div>,
} = {}) => {

  return render(
    <MemoryRouter initialEntries={["/protected"]}>

      <userDataContext.Provider
        value={{
          userData,
          loadingUser,
        }}
      >

        <ProtectedRoute>
          {children}
        </ProtectedRoute>

      </userDataContext.Provider>

    </MemoryRouter>
  );
};


describe("ProtectedRoute Component", () => {


  // ==========================================
  // LOADING STATE
  // ==========================================

  test("shows Checking login while loading", () => {

    renderProtectedRoute({
      loadingUser: true,
      userData: null,
    });

    expect(
      screen.getByText("Checking login...")
    ).toBeInTheDocument();

  });


  test("does not show protected content while loading", () => {

    renderProtectedRoute({
      loadingUser: true,
      userData: null,
    });

    expect(
      screen.queryByText("Protected Content")
    ).not.toBeInTheDocument();

  });


  // ==========================================
  // LOGGED OUT
  // ==========================================

  test("redirects unauthenticated user to login", () => {

    renderProtectedRoute({
      loadingUser: false,
      userData: null,
    });

    expect(
      window.location.pathname
    ).toBe("/");

  });


  // ==========================================
  // LOGGED IN
  // ==========================================

  test("renders protected content for logged-in user", () => {

    renderProtectedRoute({
      loadingUser: false,
      userData: {
        username: "shakthi",
      },
    });

    expect(
      screen.getByText("Protected Content")
    ).toBeInTheDocument();

  });


  test("does not show Checking login when user is authenticated", () => {

    renderProtectedRoute({
      loadingUser: false,
      userData: {
        username: "shakthi",
      },
    });

    expect(
      screen.queryByText("Checking login...")
    ).not.toBeInTheDocument();

  });


  // ==========================================
  // CHILD COMPONENT
  // ==========================================

  test("renders child component when authenticated", () => {

    renderProtectedRoute({
      userData: {
        username: "shakthi",
      },
      children: (
        <div>
          Create Post Page
        </div>
      ),
    });

    expect(
      screen.getByText("Create Post Page")
    ).toBeInTheDocument();

  });

});