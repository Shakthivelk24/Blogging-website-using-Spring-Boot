import React from "react";

import {
  describe,
  test,
  expect,
  vi,
  beforeEach,
} from "vitest";

import {
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import UserContext from "./UserContext";

import { userDataContext } from "./DataContext";

import axios from "axios";


// ==========================================
// MOCK AXIOS
// ==========================================

vi.mock("axios", () => ({
  default: {
    get: vi.fn(),
  },
}));


// ==========================================
// TEST COMPONENT
// ==========================================

function TestComponent() {

  const {
    serverUrl,
    post,
    userData,
    loadingUser,
  } = React.useContext(userDataContext);

  return (
    <div>

      <p data-testid="server-url">
        {serverUrl}
      </p>

      <p data-testid="post">
        {post === null
          ? "No Post"
          : "Post Available"}
      </p>

      <p data-testid="user">
        {userData
          ? userData.username
          : "No User"}
      </p>

      <p data-testid="loading">
        {loadingUser
          ? "Loading"
          : "Loaded"}
      </p>

    </div>
  );
}


// ==========================================
// TEST HELPER
// ==========================================

const renderUserContext = () => {

  return render(
    <UserContext>

      <TestComponent />

    </UserContext>
  );
};


// ==========================================
// TESTS
// ==========================================

describe("UserContext", () => {

  beforeEach(() => {

    vi.clearAllMocks();

  });


  // ========================================
  // SERVER URL
  // ========================================

  test("provides correct server URL", () => {

    axios.get.mockResolvedValue({
      data: {
        username: "shakthi",
      },
    });

    renderUserContext();

    expect(
      screen.getByTestId("server-url")
    ).toHaveTextContent("/api");

  });


  // ========================================
  // INITIAL POST STATE
  // ========================================

  test("initializes post as null", () => {

    axios.get.mockResolvedValue({
      data: {
        username: "shakthi",
      },
    });

    renderUserContext();

    expect(
      screen.getByTestId("post")
    ).toHaveTextContent("No Post");

  });


  // ========================================
  // INITIAL LOADING STATE
  // ========================================

  test("starts with loading state", () => {

    axios.get.mockImplementation(
      () => new Promise(() => {})
    );

    renderUserContext();

    expect(
      screen.getByTestId("loading")
    ).toHaveTextContent("Loading");

  });


  // ========================================
  // CURRENT USER API
  // ========================================

  test("calls current user API", async () => {

    axios.get.mockResolvedValue({
      data: {
        username: "shakthi",
      },
    });

    renderUserContext();

    await waitFor(() => {

      expect(axios.get).toHaveBeenCalledWith(
        "/api/api/user/current",
        {
          withCredentials: true,
        }
      );

    });

  });


  // ========================================
  // USER DATA
  // ========================================

  test("sets user data after successful API call", async () => {

    axios.get.mockResolvedValue({
      data: {
        username: "shakthi",
      },
    });

    renderUserContext();

    await waitFor(() => {

      expect(
        screen.getByTestId("user")
      ).toHaveTextContent("shakthi");

    });

  });


  // ========================================
  // LOADING COMPLETE
  // ========================================

  test("sets loading to false after successful API call", async () => {

    axios.get.mockResolvedValue({
      data: {
        username: "shakthi",
      },
    });

    renderUserContext();

    await waitFor(() => {

      expect(
        screen.getByTestId("loading")
      ).toHaveTextContent("Loaded");

    });

  });


  // ========================================
  // API ERROR
  // ========================================

  test("handles API error", async () => {

    axios.get.mockRejectedValue(
      new Error("Unauthorized")
    );

    renderUserContext();

    await waitFor(() => {

      expect(
        screen.getByTestId("loading")
      ).toHaveTextContent("Loaded");

    });

  });


  // ========================================
  // USER REMAINS NULL ON ERROR
  // ========================================

  test("keeps userData null when API fails", async () => {

    axios.get.mockRejectedValue(
      new Error("Unauthorized")
    );

    renderUserContext();

    await waitFor(() => {

      expect(
        screen.getByTestId("user")
      ).toHaveTextContent("No User");

    });

  });

});