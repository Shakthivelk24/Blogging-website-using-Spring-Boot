import {
  describe,
  test,
  expect,
  vi,
  beforeEach,
  afterEach,
} from "vitest";

import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";

import {
  MemoryRouter,
  useLocation,
} from "react-router-dom";

import Header from "./Header";

import {
  userDataContext,
} from "../context/DataContext.jsx";

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
// CURRENT LOCATION
// ==========================================

function CurrentLocation() {

  const location = useLocation();

  return (
    <div data-testid="current-location">
      {location.pathname}
      {location.search}
    </div>
  );
}


// ==========================================
// RENDER HEADER
// ==========================================

const renderHeader = (
  userData = null,
  initialEntry = "/"
) => {

  const contextValue = {

    userData,

    setUserData: vi.fn(),

    serverUrl:
      "http://localhost:8083",

  };

  return render(

    <MemoryRouter
      initialEntries={[initialEntry]}
    >

      <userDataContext.Provider
        value={contextValue}
      >

        <Header />

        <CurrentLocation />

      </userDataContext.Provider>

    </MemoryRouter>

  );
};


// ==========================================
// TEST USER
// ==========================================

const loggedInUser = {
  username: "shakthi",
};


// ==========================================
// TESTS
// ==========================================

describe(
  "Header Component",
  () => {

    beforeEach(() => {

      vi.clearAllMocks();

    });


    afterEach(() => {

      vi.useRealTimers();

    });


    // ========================================
    // LOGO
    // ========================================

    test(
      "renders SparkNote logo",
      () => {

        renderHeader();

        expect(
          screen.getByText("Spark")
        ).toBeInTheDocument();

        expect(
          screen.getByText("Note")
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Share Your Stories"
          )
        ).toBeInTheDocument();

      }
    );


    test(
      "renders logo icon",
      () => {

        renderHeader();

        expect(
          screen.getByText("S")
        ).toBeInTheDocument();

      }
    );


    // ========================================
    // SEARCH
    // ========================================

    test(
      "renders search input on home page",
      () => {

        renderHeader();

        const searchInputs =
          screen.getAllByPlaceholderText(
            "Search stories..."
          );

        expect(
          searchInputs.length
        ).toBeGreaterThan(0);

      }
    );


    test(
      "updates search input value",
      () => {

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

      }
    );


    test(
      "navigates to search URL when search text is entered",
      async () => {

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

        await waitFor(
          () => {

            expect(
              screen.getByTestId(
                "current-location"
              )
            ).toHaveTextContent(
              "/?search=Java"
            );

          },
          {
            timeout: 1000,
          }
        );

      }
    );


    test(
      "navigates to home when search is cleared",
      async () => {

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

        await waitFor(
          () => {

            expect(
              screen.getByTestId(
                "current-location"
              )
            ).toHaveTextContent(
              "/?search=Java"
            );

          },
          {
            timeout: 1000,
          }
        );

        fireEvent.change(
          searchInput,
          {
            target: {
              value: "",
            },
          }
        );

        await waitFor(
          () => {

            expect(
              screen.getByTestId(
                "current-location"
              )
            ).toHaveTextContent(
              "/"
            );

          },
          {
            timeout: 1000,
          }
        );

      }
    );


    test(
      "trims search text before navigation",
      async () => {

        renderHeader();

        const searchInput =
          screen.getAllByPlaceholderText(
            "Search stories..."
          )[0];

        fireEvent.change(
          searchInput,
          {
            target: {
              value: "   Java   ",
            },
          }
        );

        await waitFor(
          () => {

            expect(
              screen.getByTestId(
                "current-location"
              )
            ).toHaveTextContent(
              "/?search=Java"
            );

          },
          {
            timeout: 1000,
          }
        );

      }
    );


    // ========================================
    // LOGGED OUT USER
    // ========================================

    test(
      "shows Login button when user is logged out",
      () => {

        renderHeader(null);

        expect(
          screen.getAllByText(
            "Login"
          ).length
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
          screen.queryByText(
            "Logout"
          )
        ).not.toBeInTheDocument();

      }
    );


    test(
      "does not show My Posts when logged out",
      () => {

        renderHeader(null);

        expect(
          screen.queryByText(
            "My Posts"
          )
        ).not.toBeInTheDocument();

      }
    );


    test(
      "does not show Create Post when logged out",
      () => {

        renderHeader(null);

        expect(
          screen.queryByText(
            "Create Post"
          )
        ).not.toBeInTheDocument();

      }
    );


    // ========================================
    // LOGGED IN USER
    // ========================================

    test(
      "shows username when user is logged in",
      () => {

        renderHeader(
          loggedInUser
        );

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

        renderHeader(
          loggedInUser
        );

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

        renderHeader(
          loggedInUser
        );

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

        renderHeader(
          loggedInUser
        );

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

        renderHeader(
          loggedInUser
        );

        const initials =
          screen.getAllByText("S");

        expect(
          initials.length
        ).toBeGreaterThan(0);

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

        renderHeader(
          loggedInUser
        );

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

                userData:
                  loggedInUser,

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

        renderHeader(
          loggedInUser
        );

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
      "shows default logout success message",
      async () => {

        axios.post.mockResolvedValue({
          data: {},
        });

        renderHeader(
          loggedInUser
        );

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

        renderHeader(
          loggedInUser
        );

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
          menuButton
        ).toHaveTextContent(
          "✕"
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
        ).toHaveTextContent(
          "☰"
        );

        fireEvent.click(
          menuButton
        );

        expect(
          menuButton
        ).toHaveTextContent(
          "✕"
        );

      }
    );


    test(
      "closes mobile menu when menu button is clicked again",
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
          menuButton
        ).toHaveTextContent(
          "✕"
        );

        fireEvent.click(
          menuButton
        );

        expect(
          menuButton
        ).toHaveTextContent(
          "☰"
        );

      }
    );


    test(
      "closes mobile menu when Login is clicked",
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
          menuButton
        ).toHaveTextContent(
          "✕"
        );

        const loginLinks =
          screen.getAllByText(
            "Login"
          );

        fireEvent.click(
          loginLinks[
            loginLinks.length - 1
          ]
        );

        expect(
          menuButton
        ).toHaveTextContent(
          "☰"
        );

      }
    );


    test(
      "closes mobile menu when Create Account is clicked",
      () => {

        renderHeader(null);

        const menuButton =
          screen.getByLabelText(
            "Toggle menu"
          );

        fireEvent.click(
          menuButton
        );

        const registerLinks =
          screen.getAllByText(
            "Create Account"
          );

        fireEvent.click(
          registerLinks[
            registerLinks.length - 1
          ]
        );

        expect(
          menuButton
        ).toHaveTextContent(
          "☰"
        );

      }
    );


    // ========================================
    // LOGGED-IN MOBILE MENU
    // ========================================

    test(
      "shows logged-in mobile navigation",
      () => {

        renderHeader(
          loggedInUser
        );

        const menuButton =
          screen.getByLabelText(
            "Toggle menu"
          );

        fireEvent.click(
          menuButton
        );

        expect(
          screen.getAllByText(
            "Create Post"
          ).length
        ).toBeGreaterThan(0);

        expect(
          screen.getAllByText(
            "My Posts"
          ).length
        ).toBeGreaterThan(0);

        expect(
          screen.getAllByText(
            "Logout"
          ).length
        ).toBeGreaterThan(0);

      }
    );


    test(
      "closes mobile menu when Create Post is clicked",
      () => {

        renderHeader(
          loggedInUser
        );

        const menuButton =
          screen.getByLabelText(
            "Toggle menu"
          );

        fireEvent.click(
          menuButton
        );

        const createLinks =
          screen.getAllByText(
            "Create Post"
          );

        fireEvent.click(
          createLinks[
            createLinks.length - 1
          ]
        );

        expect(
          menuButton
        ).toHaveTextContent(
          "☰"
        );

      }
    );


    test(
      "closes mobile menu when My Posts is clicked",
      () => {

        renderHeader(
          loggedInUser
        );

        const menuButton =
          screen.getByLabelText(
            "Toggle menu"
          );

        fireEvent.click(
          menuButton
        );

        const myPostLinks =
          screen.getAllByText(
            "My Posts"
          );

        fireEvent.click(
          myPostLinks[
            myPostLinks.length - 1
          ]
        );

        expect(
          menuButton
        ).toHaveTextContent(
          "☰"
        );

      }
    );


    // ========================================
    // LOGO INTERACTION
    // ========================================

    test(
      "clears search text when logo is clicked",
      () => {

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

        const logo =
          screen.getByRole(
            "link",
            {
              name: /SparkNote/i,
            }
          );

        fireEvent.click(
          logo
        );

        expect(
          searchInput.value
        ).toBe("");

      }
    );


    test(
      "closes mobile menu when logo is clicked",
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
          menuButton
        ).toHaveTextContent(
          "✕"
        );

        const logo =
          screen.getByRole(
            "link",
            {
              name: /SparkNote/i,
            }
          );

        fireEvent.click(
          logo
        );

        expect(
          menuButton
        ).toHaveTextContent(
          "☰"
        );

      }
    );


    // ========================================
    // NON-HOME PAGE
    // ========================================

    test(
      "does not show search input on login page",
      () => {

        renderHeader(
          null,
          "/login"
        );

        expect(
          screen.queryByPlaceholderText(
            "Search stories..."
          )
        ).not.toBeInTheDocument();

      }
    );


    test(
      "does not show search input on register page",
      () => {

        renderHeader(
          null,
          "/register"
        );

        expect(
          screen.queryByPlaceholderText(
            "Search stories..."
          )
        ).not.toBeInTheDocument();

      }
    );

  }
);