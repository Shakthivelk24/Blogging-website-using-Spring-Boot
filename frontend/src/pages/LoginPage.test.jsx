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

import LoginPage from "./LoginPage";

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
// MOCK NAVIGATION
// ==========================================

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {

  const actual = await vi.importActual(
    "react-router-dom"
  );

  return {
    ...actual,

    useNavigate: () => mockNavigate,
  };
});


// ==========================================
// TEST CONTEXT
// ==========================================

const mockSetUserData = vi.fn();

const renderLoginPage = () => {

  return render(

    <MemoryRouter>

      <userDataContext.Provider
        value={{
          serverUrl:
            "http://localhost:8083",

          setUserData:
            mockSetUserData,

          userData: null,

          post: null,

          setPost: vi.fn(),

          loadingUser: false,
        }}
      >

        <LoginPage />

      </userDataContext.Provider>

    </MemoryRouter>

  );
};


// ==========================================
// TEST DATA
// ==========================================

const username = "shakthi";

const password = "password123";


// ==========================================
// TESTS
// ==========================================

describe("LoginPage Component", () => {

  beforeEach(() => {

    vi.clearAllMocks();

  });


  // ========================================
  // RENDER
  // ========================================

  test(
    "renders Login heading",
    () => {

      renderLoginPage();

      expect(
        screen.getByRole(
          "heading",
          {
            name: "Login",
          }
        )
      ).toBeInTheDocument();

    }
  );


  test(
    "renders username input",
    () => {

      renderLoginPage();

      expect(
        screen.getByPlaceholderText(
          "Username"
        )
      ).toBeInTheDocument();

    }
  );


  test(
    "renders password input",
    () => {

      renderLoginPage();

      expect(
        screen.getByPlaceholderText(
          "Password"
        )
      ).toBeInTheDocument();

    }
  );


  test(
    "renders Login button",
    () => {

      renderLoginPage();

      expect(
        screen.getByRole(
          "button",
          {
            name: "Login",
          }
        )
      ).toBeInTheDocument();

    }
  );


  // ========================================
  // INPUTS
  // ========================================

  test(
    "updates username input",
    () => {

      renderLoginPage();

      const input =
        screen.getByPlaceholderText(
          "Username"
        );

      fireEvent.change(
        input,
        {
          target: {
            value: username,
          },
        }
      );

      expect(
        input.value
      ).toBe(username);

    }
  );


  test(
    "updates password input",
    () => {

      renderLoginPage();

      const input =
        screen.getByPlaceholderText(
          "Password"
        );

      fireEvent.change(
        input,
        {
          target: {
            value: password,
          },
        }
      );

      expect(
        input.value
      ).toBe(password);

    }
  );


  test(
    "password input has password type",
    () => {

      renderLoginPage();

      const input =
        screen.getByPlaceholderText(
          "Password"
        );

      expect(
        input
      ).toHaveAttribute(
        "type",
        "password"
      );

    }
  );


  // ========================================
  // EMPTY VALIDATION
  // ========================================

  test(
    "shows error when username and password are empty",
    () => {

      renderLoginPage();

      const form =
        screen.getByRole("button", {
          name: "Login",
        }).closest("form");

      fireEvent.submit(form);

      expect(
        toast.error
      ).toHaveBeenCalledWith(
        "Please enter username and password"
      );

      expect(
        axios.post
      ).not.toHaveBeenCalled();

    }
  );


  test(
    "does not call API when username is empty",
    () => {

      renderLoginPage();

      const passwordInput =
        screen.getByPlaceholderText(
          "Password"
        );

      fireEvent.change(
        passwordInput,
        {
          target: {
            value: password,
          },
        }
      );

      const form =
        screen.getByRole("button", {
          name: "Login",
        }).closest("form");

      fireEvent.submit(form);

      expect(
        toast.error
      ).toHaveBeenCalledWith(
        "Please enter username and password"
      );

      expect(
        axios.post
      ).not.toHaveBeenCalled();

    }
  );


  test(
    "does not call API when password is empty",
    () => {

      renderLoginPage();

      const usernameInput =
        screen.getByPlaceholderText(
          "Username"
        );

      fireEvent.change(
        usernameInput,
        {
          target: {
            value: username,
          },
        }
      );

      const form =
        screen.getByRole("button", {
          name: "Login",
        }).closest("form");

      fireEvent.submit(form);

      expect(
        toast.error
      ).toHaveBeenCalledWith(
        "Please enter username and password"
      );

      expect(
        axios.post
      ).not.toHaveBeenCalled();

    }
  );


  test(
    "rejects whitespace-only username",
    () => {

      renderLoginPage();

      const usernameInput =
        screen.getByPlaceholderText(
          "Username"
        );

      const passwordInput =
        screen.getByPlaceholderText(
          "Password"
        );

      fireEvent.change(
        usernameInput,
        {
          target: {
            value: "   ",
          },
        }
      );

      fireEvent.change(
        passwordInput,
        {
          target: {
            value: password,
          },
        }
      );

      const form =
        screen.getByRole("button", {
          name: "Login",
        }).closest("form");

      fireEvent.submit(form);

      expect(
        toast.error
      ).toHaveBeenCalledWith(
        "Please enter username and password"
      );

      expect(
        axios.post
      ).not.toHaveBeenCalled();

    }
  );


  // ========================================
  // SUCCESSFUL LOGIN
  // ========================================

  test(
    "calls login API with username and password",
    async () => {

      axios.post.mockResolvedValue({
        data: {
          message:
            "Login successful",
        },
      });

      renderLoginPage();

      fireEvent.change(
        screen.getByPlaceholderText(
          "Username"
        ),
        {
          target: {
            value: username,
          },
        }
      );

      fireEvent.change(
        screen.getByPlaceholderText(
          "Password"
        ),
        {
          target: {
            value: password,
          },
        }
      );

      fireEvent.click(
        screen.getByRole(
          "button",
          {
            name: "Login",
          }
        )
      );

      await waitFor(() => {

        expect(
          axios.post
        ).toHaveBeenCalledWith(

          "http://localhost:8083/api/auth/login",

          {
            username,
            password,
          },

          {
            withCredentials: true,
          }

        );

      });

    }
  );


  // ========================================
  // USER DATA
  // ========================================

  test(
    "sets user data after successful login",
    async () => {

      axios.post.mockResolvedValue({
        data: {
          message:
            "Login successful",
        },
      });

      renderLoginPage();

      fireEvent.change(
        screen.getByPlaceholderText(
          "Username"
        ),
        {
          target: {
            value: username,
          },
        }
      );

      fireEvent.change(
        screen.getByPlaceholderText(
          "Password"
        ),
        {
          target: {
            value: password,
          },
        }
      );

      fireEvent.click(
        screen.getByRole(
          "button",
          {
            name: "Login",
          }
        )
      );

      await waitFor(() => {

        expect(
          mockSetUserData
        ).toHaveBeenCalledWith({
          username,
        });

      });

    }
  );


  // ========================================
  // SUCCESS TOAST
  // ========================================

  test(
    "shows success toast after login",
    async () => {

      axios.post.mockResolvedValue({
        data: {
          message:
            "Login successful",
        },
      });

      renderLoginPage();

      fireEvent.change(
        screen.getByPlaceholderText(
          "Username"
        ),
        {
          target: {
            value: username,
          },
        }
      );

      fireEvent.change(
        screen.getByPlaceholderText(
          "Password"
        ),
        {
          target: {
            value: password,
          },
        }
      );

      fireEvent.click(
        screen.getByRole(
          "button",
          {
            name: "Login",
          }
        )
      );

      await waitFor(() => {

        expect(
          toast.success
        ).toHaveBeenCalledWith(
          "Login successful"
        );

      });

    }
  );


  // ========================================
  // NAVIGATION
  // ========================================

  test(
    "navigates to home after successful login",
    async () => {

      axios.post.mockResolvedValue({
        data: {
          message:
            "Login successful",
        },
      });

      renderLoginPage();

      fireEvent.change(
        screen.getByPlaceholderText(
          "Username"
        ),
        {
          target: {
            value: username,
          },
        }
      );

      fireEvent.change(
        screen.getByPlaceholderText(
          "Password"
        ),
        {
          target: {
            value: password,
          },
        }
      );

      fireEvent.click(
        screen.getByRole(
          "button",
          {
            name: "Login",
          }
        )
      );

      await waitFor(() => {

        expect(
          mockNavigate
        ).toHaveBeenCalledWith(
          "/"
        );

      });

    }
  );


  // ========================================
  // DEFAULT SUCCESS MESSAGE
  // ========================================

  test(
    "uses default success message when API does not return message",
    async () => {

      axios.post.mockResolvedValue({
        data: {},
      });

      renderLoginPage();

      fireEvent.change(
        screen.getByPlaceholderText(
          "Username"
        ),
        {
          target: {
            value: username,
          },
        }
      );

      fireEvent.change(
        screen.getByPlaceholderText(
          "Password"
        ),
        {
          target: {
            value: password,
          },
        }
      );

      fireEvent.click(
        screen.getByRole(
          "button",
          {
            name: "Login",
          }
        )
      );

      await waitFor(() => {

        expect(
          toast.success
        ).toHaveBeenCalledWith(
          "Login successful"
        );

      });

    }
  );


  // ========================================
  // API ERROR
  // ========================================

  test(
    "shows API error message when login fails",
    async () => {

      axios.post.mockRejectedValue({
        response: {
          data: {
            message:
              "Invalid username or password",
          },
        },
      });

      renderLoginPage();

      fireEvent.change(
        screen.getByPlaceholderText(
          "Username"
        ),
        {
          target: {
            value: username,
          },
        }
      );

      fireEvent.change(
        screen.getByPlaceholderText(
          "Password"
        ),
        {
          target: {
            value: password,
          },
        }
      );

      fireEvent.click(
        screen.getByRole(
          "button",
          {
            name: "Login",
          }
        )
      );

      await waitFor(() => {

        expect(
          toast.error
        ).toHaveBeenCalledWith(
          "Invalid username or password"
        );

      });

    }
  );


  // ========================================
  // DEFAULT ERROR MESSAGE
  // ========================================

  test(
    "uses default error message when API provides no message",
    async () => {

      axios.post.mockRejectedValue({
        response: {
          data: {},
        },
      });

      renderLoginPage();

      fireEvent.change(
        screen.getByPlaceholderText(
          "Username"
        ),
        {
          target: {
            value: username,
          },
        }
      );

      fireEvent.change(
        screen.getByPlaceholderText(
          "Password"
        ),
        {
          target: {
            value: password,
          },
        }
      );

      fireEvent.click(
        screen.getByRole(
          "button",
          {
            name: "Login",
          }
        )
      );

      await waitFor(() => {

        expect(
          toast.error
        ).toHaveBeenCalledWith(
          "Invalid username or password"
        );

      });

    }
  );


  // ========================================
  // NETWORK ERROR
  // ========================================

  test(
    "shows default error for network failure",
    async () => {

      axios.post.mockRejectedValue(
        new Error("Network Error")
      );

      renderLoginPage();

      fireEvent.change(
        screen.getByPlaceholderText(
          "Username"
        ),
        {
          target: {
            value: username,
          },
        }
      );

      fireEvent.change(
        screen.getByPlaceholderText(
          "Password"
        ),
        {
          target: {
            value: password,
          },
        }
      );

      fireEvent.click(
        screen.getByRole(
          "button",
          {
            name: "Login",
          }
        )
      );

      await waitFor(() => {

        expect(
          toast.error
        ).toHaveBeenCalledWith(
          "Invalid username or password"
        );

      });

    }
  );


  // ========================================
  // LOADING STATE
  // ========================================

  test(
    "shows Logging in while request is in progress",
    async () => {

      let resolveLogin;

      axios.post.mockReturnValue(
        new Promise((resolve) => {

          resolveLogin = resolve;

        })
      );

      renderLoginPage();

      fireEvent.change(
        screen.getByPlaceholderText(
          "Username"
        ),
        {
          target: {
            value: username,
          },
        }
      );

      fireEvent.change(
        screen.getByPlaceholderText(
          "Password"
        ),
        {
          target: {
            value: password,
          },
        }
      );

      fireEvent.click(
        screen.getByRole(
          "button",
          {
            name: "Login",
          }
        )
      );

      const loadingButton =
        screen.getByRole(
          "button",
          {
            name: "Logging in...",
          }
        );

      expect(
        loadingButton
      ).toBeInTheDocument();

      expect(
        loadingButton
      ).toBeDisabled();

      resolveLogin({
        data: {
          message:
            "Login successful",
        },
      });

      await waitFor(() => {

        expect(
          mockNavigate
        ).toHaveBeenCalledWith(
          "/"
        );

      });

    }
  );


  // ========================================
  // BUTTON ENABLED INITIALLY
  // ========================================

  test(
    "login button is enabled initially",
    () => {

      renderLoginPage();

      expect(
        screen.getByRole(
          "button",
          {
            name: "Login",
          }
        )
      ).not.toBeDisabled();

    }
  );

});