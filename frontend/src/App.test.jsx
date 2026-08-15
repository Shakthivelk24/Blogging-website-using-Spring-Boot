import React from "react";

import {
  describe,
  test,
  expect,
  vi,
} from "vitest";

import {
  render,
  screen,
} from "@testing-library/react";

import {
  MemoryRouter,
  Outlet,
} from "react-router-dom";

import App from "./App";


// ==========================================
// MOCK REACT HOT TOAST
// ==========================================

vi.mock("react-hot-toast", () => ({
  Toaster: () => (
    <div data-testid="toaster">
      Toaster
    </div>
  ),
}));


// ==========================================
// MOCK LAYOUT
// IMPORTANT: Outlet is required because
// App uses nested routes.
// ==========================================

vi.mock("./components/Layout", () => ({
  default: () => (
    <div data-testid="layout">

      <div>
        Layout
      </div>

      <Outlet />

    </div>
  ),
}));


// ==========================================
// MOCK PAGES
// ==========================================

vi.mock("./pages/IndexPage", () => ({
  default: () => (
    <div data-testid="index-page">
      Home Page
    </div>
  ),
}));


vi.mock("./pages/LoginPage", () => ({
  default: () => (
    <div data-testid="login-page">
      Login Page
    </div>
  ),
}));


vi.mock("./pages/RegisterPage", () => ({
  default: () => (
    <div data-testid="register-page">
      Register Page
    </div>
  ),
}));


vi.mock("./pages/CreatePost", () => ({
  default: () => (
    <div data-testid="create-post-page">
      Create Post Page
    </div>
  ),
}));


vi.mock("./pages/MyPost", () => ({
  default: () => (
    <div data-testid="my-post-page">
      My Posts Page
    </div>
  ),
}));


vi.mock("./pages/EditPost", () => ({
  default: () => (
    <div data-testid="edit-post-page">
      Edit Post Page
    </div>
  ),
}));


vi.mock("./pages/PostDetails", () => ({
  default: () => (
    <div data-testid="post-details-page">
      Post Details Page
    </div>
  ),
}));


// ==========================================
// MOCK PROTECTED ROUTE
// ==========================================

vi.mock("./components/ProtectedRoute.jsx", () => ({
  default: ({ children }) => (
    <div data-testid="protected-route">

      {children}

    </div>
  ),
}));


// ==========================================
// TESTS
// ==========================================

describe("App Component", () => {


  // ========================================
  // HOME
  // ========================================

  test("renders the application", () => {

    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    expect(
      screen.getByTestId("layout")
    ).toBeInTheDocument();

    expect(
      screen.getByTestId("index-page")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Home Page")
    ).toBeInTheDocument();

  });


  // ========================================
  // LOGIN
  // ========================================

  test("renders Login page", () => {

    render(
      <MemoryRouter initialEntries={["/login"]}>
        <App />
      </MemoryRouter>
    );

    expect(
      screen.getByTestId("login-page")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Login Page")
    ).toBeInTheDocument();

  });


  // ========================================
  // REGISTER
  // ========================================

  test("renders Register page", () => {

    render(
      <MemoryRouter initialEntries={["/register"]}>
        <App />
      </MemoryRouter>
    );

    expect(
      screen.getByTestId("register-page")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Register Page")
    ).toBeInTheDocument();

  });


  // ========================================
  // CREATE POST
  // ========================================

  test("renders Create Post page", () => {

    render(
      <MemoryRouter initialEntries={["/create-post"]}>
        <App />
      </MemoryRouter>
    );

    expect(
      screen.getByTestId("create-post-page")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Create Post Page")
    ).toBeInTheDocument();

  });


  // ========================================
  // MY POSTS
  // ========================================

  test("renders My Posts page", () => {

    render(
      <MemoryRouter initialEntries={["/mypost"]}>
        <App />
      </MemoryRouter>
    );

    expect(
      screen.getByTestId("my-post-page")
    ).toBeInTheDocument();

    expect(
      screen.getByText("My Posts Page")
    ).toBeInTheDocument();

  });


  // ========================================
  // EDIT POST
  // ========================================

  test("renders Edit Post page", () => {

    render(
      <MemoryRouter initialEntries={["/edit-post/1"]}>
        <App />
      </MemoryRouter>
    );

    expect(
      screen.getByTestId("edit-post-page")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Edit Post Page")
    ).toBeInTheDocument();

  });


  // ========================================
  // POST DETAILS
  // ========================================

  test("renders Post Details page", () => {

    render(
      <MemoryRouter initialEntries={["/post/1"]}>
        <App />
      </MemoryRouter>
    );

    expect(
      screen.getByTestId("post-details-page")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Post Details Page")
    ).toBeInTheDocument();

  });


  // ========================================
  // PROTECTED ROUTE
  // ========================================

  test("renders protected route for Create Post", () => {

    render(
      <MemoryRouter initialEntries={["/create-post"]}>
        <App />
      </MemoryRouter>
    );

    expect(
      screen.getByTestId("protected-route")
    ).toBeInTheDocument();

  });


  test("renders protected route for My Posts", () => {

    render(
      <MemoryRouter initialEntries={["/mypost"]}>
        <App />
      </MemoryRouter>
    );

    expect(
      screen.getByTestId("protected-route")
    ).toBeInTheDocument();

  });


  test("renders protected route for Edit Post", () => {

    render(
      <MemoryRouter initialEntries={["/edit-post/1"]}>
        <App />
      </MemoryRouter>
    );

    expect(
      screen.getByTestId("protected-route")
    ).toBeInTheDocument();

  });


  // ========================================
  // TOASTER
  // ========================================

  test("renders Toaster", () => {

    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    expect(
      screen.getByTestId("toaster")
    ).toBeInTheDocument();

  });

});