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

import RegisterPage from "./RegisterPage";

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

const renderRegisterPage = (
  contextValue = {}
) => {

  const defaultContext = {
    serverUrl:
      "http://localhost:8083",

    ...contextValue,
  };

  return render(

    <MemoryRouter>

      <userDataContext.Provider
        value={defaultContext}
      >

        <RegisterPage />

      </userDataContext.Provider>

    </MemoryRouter>

  );
};


// ==========================================
// TEST DATA
// ==========================================

const username = "shakthi";

const email = "shakthi@example.com";

const password = "password123";


// ==========================================
// TESTS
// ==========================================

describe(
  "RegisterPage Component",
  () => {

    beforeEach(() => {

      vi.clearAllMocks();

    });


    // ========================================
    // RENDERING
    // ========================================

    test(
      "renders Register heading",
      () => {

        renderRegisterPage();

        expect(
          screen.getByRole(
            "heading",
            {
              name: "Register",
            }
          )
        ).toBeInTheDocument();

      }
    );


    test(
      "renders username input",
      () => {

        renderRegisterPage();

        expect(
          screen.getByPlaceholderText(
            "Username"
          )
        ).toBeInTheDocument();

      }
    );


    test(
      "renders email input",
      () => {

        renderRegisterPage();

        expect(
          screen.getByPlaceholderText(
            "Email"
          )
        ).toBeInTheDocument();

      }
    );


    test(
      "renders password input",
      () => {

        renderRegisterPage();

        expect(
          screen.getByPlaceholderText(
            "Password"
          )
        ).toBeInTheDocument();

      }
    );


    test(
      "renders Register button",
      () => {

        renderRegisterPage();

        expect(
          screen.getByRole(
            "button",
            {
              name: "Register",
            }
          )
        ).toBeInTheDocument();

      }
    );


    // ========================================
    // INPUT TESTS
    // ========================================

    test(
      "updates username input",
      () => {

        renderRegisterPage();

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
      "updates email input",
      () => {

        renderRegisterPage();

        const input =
          screen.getByPlaceholderText(
            "Email"
          );

        fireEvent.change(
          input,
          {
            target: {
              value: email,
            },
          }
        );

        expect(
          input.value
        ).toBe(email);

      }
    );


    test(
      "updates password input",
      () => {

        renderRegisterPage();

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
      "email input has email type",
      () => {

        renderRegisterPage();

        expect(
          screen.getByPlaceholderText(
            "Email"
          )
        ).toHaveAttribute(
          "type",
          "email"
        );

      }
    );


    test(
      "password input has password type",
      () => {

        renderRegisterPage();

        expect(
          screen.getByPlaceholderText(
            "Password"
          )
        ).toHaveAttribute(
          "type",
          "password"
        );

      }
    );


    // ========================================
    // VALIDATION
    // ========================================

    test(
      "shows error when all fields are empty",
      () => {

        renderRegisterPage();

        const form =
          screen.getByRole(
            "button",
            {
              name: "Register",
            }
          ).closest("form");

        fireEvent.submit(form);

        expect(
          toast.error
        ).toHaveBeenCalledWith(
          "Please fill all fields"
        );

        expect(
          axios.post
        ).not.toHaveBeenCalled();

      }
    );


    test(
      "does not submit when username is empty",
      () => {

        renderRegisterPage();

        fireEvent.change(
          screen.getByPlaceholderText(
            "Email"
          ),
          {
            target: {
              value: email,
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

        const form =
          screen.getByRole(
            "button",
            {
              name: "Register",
            }
          ).closest("form");

        fireEvent.submit(form);

        expect(
          toast.error
        ).toHaveBeenCalledWith(
          "Please fill all fields"
        );

        expect(
          axios.post
        ).not.toHaveBeenCalled();

      }
    );


    test(
      "does not submit when email is empty",
      () => {

        renderRegisterPage();

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

        const form =
          screen.getByRole(
            "button",
            {
              name: "Register",
            }
          ).closest("form");

        fireEvent.submit(form);

        expect(
          toast.error
        ).toHaveBeenCalledWith(
          "Please fill all fields"
        );

        expect(
          axios.post
        ).not.toHaveBeenCalled();

      }
    );


    test(
      "does not submit when password is empty",
      () => {

        renderRegisterPage();

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
            "Email"
          ),
          {
            target: {
              value: email,
            },
          }
        );

        const form =
          screen.getByRole(
            "button",
            {
              name: "Register",
            }
          ).closest("form");

        fireEvent.submit(form);

        expect(
          toast.error
        ).toHaveBeenCalledWith(
          "Please fill all fields"
        );

        expect(
          axios.post
        ).not.toHaveBeenCalled();

      }
    );


    test(
      "rejects whitespace-only username",
      () => {

        renderRegisterPage();

        fireEvent.change(
          screen.getByPlaceholderText(
            "Username"
          ),
          {
            target: {
              value: "   ",
            },
          }
        );

        fireEvent.change(
          screen.getByPlaceholderText(
            "Email"
          ),
          {
            target: {
              value: email,
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

        const form =
          screen.getByRole(
            "button",
            {
              name: "Register",
            }
          ).closest("form");

        fireEvent.submit(form);

        expect(
          toast.error
        ).toHaveBeenCalledWith(
          "Please fill all fields"
        );

        expect(
          axios.post
        ).not.toHaveBeenCalled();

      }
    );


    test(
      "rejects whitespace-only email",
      () => {

        renderRegisterPage();

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
            "Email"
          ),
          {
            target: {
              value: "   ",
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

        const form =
          screen.getByRole(
            "button",
            {
              name: "Register",
            }
          ).closest("form");

        fireEvent.submit(form);

        expect(
          toast.error
        ).toHaveBeenCalledWith(
          "Please fill all fields"
        );

        expect(
          axios.post
        ).not.toHaveBeenCalled();

      }
    );


    // ========================================
    // SUCCESSFUL REGISTRATION
    // ========================================

    test(
      "calls registration API with correct data",
      async () => {

        axios.post.mockResolvedValue({
          data: {
            message:
              "Registration successful",
          },
        });

        renderRegisterPage();

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
            "Email"
          ),
          {
            target: {
              value: email,
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
              name: "Register",
            }
          )
        );

        await waitFor(() => {

          expect(
            axios.post
          ).toHaveBeenCalledWith(

            "http://localhost:8083/api/auth/register",

            {
              username,
              email,
              password,
            }

          );

        });

      }
    );


    // ========================================
    // SUCCESS TOAST
    // ========================================

    test(
      "shows success toast after registration",
      async () => {

        axios.post.mockResolvedValue({
          data: {
            message:
              "Registration successful",
          },
        });

        renderRegisterPage();

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
            "Email"
          ),
          {
            target: {
              value: email,
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
              name: "Register",
            }
          )
        );

        await waitFor(() => {

          expect(
            toast.success
          ).toHaveBeenCalledWith(
            "Registration successful"
          );

        });

      }
    );


    // ========================================
    // NAVIGATION
    // ========================================

    test(
      "navigates to login after successful registration",
      async () => {

        axios.post.mockResolvedValue({
          data: {
            message:
              "Registration successful",
          },
        });

        renderRegisterPage();

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
            "Email"
          ),
          {
            target: {
              value: email,
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
              name: "Register",
            }
          )
        );

        await waitFor(() => {

          expect(
            mockNavigate
          ).toHaveBeenCalledWith(
            "/login"
          );

        });

      }
    );


    // ========================================
    // DEFAULT SUCCESS MESSAGE
    // ========================================

    test(
      "uses default success message when API returns no message",
      async () => {

        axios.post.mockResolvedValue({
          data: {},
        });

        renderRegisterPage();

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
            "Email"
          ),
          {
            target: {
              value: email,
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
              name: "Register",
            }
          )
        );

        await waitFor(() => {

          expect(
            toast.success
          ).toHaveBeenCalledWith(
            "Registration successful"
          );

        });

      }
    );


    // ========================================
    // API ERROR
    // ========================================

    test(
      "shows API error message when registration fails",
      async () => {

        axios.post.mockRejectedValue({
          response: {
            data: {
              message:
                "Username already exists",
            },
          },
        });

        renderRegisterPage();

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
            "Email"
          ),
          {
            target: {
              value: email,
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
              name: "Register",
            }
          )
        );

        await waitFor(() => {

          expect(
            toast.error
          ).toHaveBeenCalledWith(
            "Username already exists"
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

        renderRegisterPage();

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
            "Email"
          ),
          {
            target: {
              value: email,
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
              name: "Register",
            }
          )
        );

        await waitFor(() => {

          expect(
            toast.error
          ).toHaveBeenCalledWith(
            "Registration failed"
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

        renderRegisterPage();

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
            "Email"
          ),
          {
            target: {
              value: email,
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
              name: "Register",
            }
          )
        );

        await waitFor(() => {

          expect(
            toast.error
          ).toHaveBeenCalledWith(
            "Registration failed"
          );

        });

      }
    );


    // ========================================
    // LOADING STATE
    // ========================================

    test(
      "shows Registering while request is in progress",
      async () => {

        let resolveRegister;

        axios.post.mockReturnValue(
          new Promise((resolve) => {

            resolveRegister = resolve;

          })
        );

        renderRegisterPage();

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
            "Email"
          ),
          {
            target: {
              value: email,
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
              name: "Register",
            }
          )
        );

        expect(
          screen.getByRole(
            "button",
            {
              name: "Registering...",
            }
          )
        ).toBeDisabled();


        resolveRegister({
          data: {
            message:
              "Registration successful",
          },
        });

        await waitFor(() => {

          expect(
            mockNavigate
          ).toHaveBeenCalledWith(
            "/login"
          );

        });

      }
    );


    // ========================================
    // SERVER URL
    // ========================================

    test(
      "uses serverUrl from context",
      async () => {

        axios.post.mockResolvedValue({
          data: {
            message:
              "Registration successful",
          },
        });

        renderRegisterPage({
          serverUrl:
            "http://localhost:9000",
        });

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
            "Email"
          ),
          {
            target: {
              value: email,
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
              name: "Register",
            }
          )
        );

        await waitFor(() => {

          expect(
            axios.post
          ).toHaveBeenCalledWith(

            "http://localhost:9000/api/auth/register",

            {
              username,
              email,
              password,
            }

          );

        });

      }
    );

  }
);