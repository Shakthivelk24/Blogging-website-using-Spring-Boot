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
  fireEvent,
  waitFor,
} from "@testing-library/react";

import { MemoryRouter } from "react-router-dom";

import Header from "./Header";

import { userDataContext } from "../context/DataContext.jsx";

import axios from "axios";

import toast from "react-hot-toast";


// ==========================================
// MOCK AXIOS
// ==========================================

vi.mock("axios", () => ({
  default: {
    post: vi.fn(),
  },
}));


// ==========================================
// MOCK TOAST
// ==========================================

vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));


// ==========================================
// TEST CONTEXT
// ==========================================

const renderHeader = (userData = null) => {

  const contextValue = {
    userData,

    setUserData: vi.fn(),

    serverUrl: "http://localhost:8083",
  };

  return render(

    <MemoryRouter initialEntries={["/"]}>

      <userDataContext.Provider value={contextValue}>

        <Header />

      </userDataContext.Provider>

    </MemoryRouter>

  );
};


// ==========================================
// TESTS
// ==========================================

describe("Header Component", () => {

  beforeEach(() => {

    vi.clearAllMocks();

  });


  // ========================================
  // LOGO
  // ========================================

  test("renders SparkNote logo", () => {

    renderHeader();

    expect(
      screen.getByText("Spark")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Note")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Share Your Stories")
    ).toBeInTheDocument();

  });


  // ========================================
  // SEARCH
  // ========================================

  test("renders search input on home page", () => {

    renderHeader();

    const searchInputs =
      screen.getAllByPlaceholderText(
        "Search stories..."
      );

    expect(
      searchInputs.length
    ).toBeGreaterThan(0);

  });


  test("updates search input value", () => {

    renderHeader();

    const searchInput =
      screen.getAllByPlaceholderText(
        "Search stories..."
      )[0];

    fireEvent.change(
      searchInput,
      {
        target: {
          value: "Java",
        },
      }
    );

    expect(
      searchInput.value
    ).toBe("Java");

  });


  // ========================================
  // LOGGED OUT USER
  // ========================================

  test(
    "shows Login button when user is logged out",
    () => {

      renderHeader(null);

      expect(
        screen.getAllByText("Login").length
      ).toBeGreaterThan(0);

    }
  );


  test(
    "shows Create Account button when logged out",
    () => {

      renderHeader(null);

      expect(
        screen.getAllByText(
          "Create Account"
        ).length
      ).toBeGreaterThan(0);

    }
  );


  test(
    "does not show Logout button when logged out",
    () => {

      renderHeader(null);

      expect(
        screen.queryByText("Logout")
      ).not.toBeInTheDocument();

    }
  );


  test(
    "does not show My Posts when logged out",
    () => {

      renderHeader(null);

      expect(
        screen.queryByText("My Posts")
      ).not.toBeInTheDocument();

    }
  );


  // ========================================
  // LOGGED IN USER
  // ========================================

  test(
    "shows username when user is logged in",
    () => {

      renderHeader({
        username: "shakthi",
      });

      expect(
        screen.getAllByText(
          "shakthi"
        ).length
      ).toBeGreaterThan(0);

    }
  );


  test(
    "shows Create button when user is logged in",
    () => {

      renderHeader({
        username: "shakthi",
      });

      expect(
        screen.getAllByText(
          "Create"
        ).length
      ).toBeGreaterThan(0);

    }
  );


  test(
    "shows My Posts when user is logged in",
    () => {

      renderHeader({
        username: "shakthi",
      });

      expect(
        screen.getAllByText(
          "My Posts"
        ).length
      ).toBeGreaterThan(0);

    }
  );


  test(
    "shows Logout when user is logged in",
    () => {

      renderHeader({
        username: "shakthi",
      });

      expect(
        screen.getAllByText(
          "Logout"
        ).length
      ).toBeGreaterThan(0);

    }
  );


  test(
    "shows correct user initial",
    () => {

      renderHeader({
        username: "shakthi",
      });

      expect(
        screen.getAllByText("S").length
      ).toBeGreaterThan(0);

    }
  );


  // ========================================
  // LOGOUT
  // ========================================

  test(
    "calls logout API when Logout is clicked",
    async () => {

      axios.post.mockResolvedValue({
        data: {
          message:
            "Logged out successfully",
        },
      });

      renderHeader({
        username: "shakthi",
      });

      const logoutButtons =
        screen.getAllByText(
          "Logout"
        );

      fireEvent.click(
        logoutButtons[0]
      );

      await waitFor(() => {

        expect(
          axios.post
        ).toHaveBeenCalledWith(

          "http://localhost:8083/api/auth/logout",

          {},

          {
            withCredentials: true,
          }

        );

      });

    }
  );


  test(
    "clears user data after successful logout",
    async () => {

      axios.post.mockResolvedValue({
        data: {
          message:
            "Logged out successfully",
        },
      });

      const setUserData =
        vi.fn();

      render(

        <MemoryRouter
          initialEntries={["/"]}
        >

          <userDataContext.Provider
            value={{
              userData: {
                username: "shakthi",
              },

              setUserData,

              serverUrl:
                "http://localhost:8083",
            }}
          >

            <Header />

          </userDataContext.Provider>

        </MemoryRouter>

      );

      fireEvent.click(
        screen.getAllByText(
          "Logout"
        )[0]
      );

      await waitFor(() => {

        expect(
          setUserData
        ).toHaveBeenCalledWith(
          null
        );

      });

    }
  );


  test(
    "shows logout success toast",
    async () => {

      axios.post.mockResolvedValue({
        data: {
          message:
            "Logged out successfully",
        },
      });

      renderHeader({
        username: "shakthi",
      });

      fireEvent.click(
        screen.getAllByText(
          "Logout"
        )[0]
      );

      await waitFor(() => {

        expect(
          toast.success
        ).toHaveBeenCalledWith(
          "Logged out successfully"
        );

      });

    }
  );


  test(
    "shows error toast when logout fails",
    async () => {

      axios.post.mockRejectedValue({
        response: {
          data: {
            message:
              "Logout failed",
          },
        },
      });

      renderHeader({
        username: "shakthi",
      });

      fireEvent.click(
        screen.getAllByText(
          "Logout"
        )[0]
      );

      await waitFor(() => {

        expect(
          toast.error
        ).toHaveBeenCalledWith(
          "Error in logging out"
        );

      });

    }
  );


  // ========================================
  // MOBILE MENU
  // ========================================

  test(
    "opens mobile menu when menu button is clicked",
    () => {

      renderHeader(null);

      const menuButton =
        screen.getByLabelText(
          "Toggle menu"
        );

      fireEvent.click(
        menuButton
      );

      expect(
        screen.getAllByText(
          "Login"
        ).length
      ).toBeGreaterThan(0);

    }
  );


  test(
    "changes menu button to close icon",
    () => {

      renderHeader(null);

      const menuButton =
        screen.getByLabelText(
          "Toggle menu"
        );

      expect(
        menuButton
      ).toHaveTextContent("☰");

      fireEvent.click(
        menuButton
      );

      expect(
        menuButton
      ).toHaveTextContent("✕");

    }
  );


  // ========================================
  // USERNAME FALLBACK
  // ========================================

  test(
    "uses userName when username is unavailable",
    () => {

      renderHeader({
        userName: "ShakthiVel",
      });

      expect(
        screen.getAllByText(
          "ShakthiVel"
        ).length
      ).toBeGreaterThan(0);

    }
  );


  test(
    "uses User as fallback username",
    () => {

      renderHeader({});

      expect(
        screen.getAllByText(
          "User"
        ).length
      ).toBeGreaterThan(0);

    }
  );

});