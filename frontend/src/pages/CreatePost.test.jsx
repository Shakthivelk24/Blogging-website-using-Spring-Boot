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

import CreatePost from "./CreatePost";

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

const setPost = vi.fn();

const renderCreatePost = () => {

  return render(

    <MemoryRouter>

      <userDataContext.Provider
        value={{
          serverUrl:
            "http://localhost:8083",

          setPost,

          post: null,

          userData: {
            username: "shakthi",
          },
        }}
      >

        <CreatePost />

      </userDataContext.Provider>

    </MemoryRouter>

  );

};


// ==========================================
// TEST DATA
// ==========================================

const validTitle =
  "My First Blog Post";

const validContent =
  "This is a valid blog post content that contains more than one hundred characters. It is long enough to satisfy the minimum content validation required by the CreatePost component.";


// ==========================================
// TESTS
// ==========================================

describe("CreatePost Component", () => {

  beforeEach(() => {

    vi.clearAllMocks();

  });


  // ========================================
  // RENDERING
  // ========================================

  test(
    "renders Create Post form",
    () => {

      renderCreatePost();

      expect(
        screen.getByText("Title")
      ).toBeInTheDocument();

      expect(
        screen.getByText("Content")
      ).toBeInTheDocument();

      expect(
        screen.getByPlaceholderText(
          "Enter title here"
        )
      ).toBeInTheDocument();

      expect(
        screen.getByPlaceholderText(
          "Enter content here"
        )
      ).toBeInTheDocument();

    }
  );


  // ========================================
  // CHARACTER COUNTER
  // ========================================

  test(
    "shows content character counter",
    () => {

      renderCreatePost();

      expect(
        screen.getByText(
          "0 / 500 characters (Min 100)"
        )
      ).toBeInTheDocument();

    }
  );


  // ========================================
  // TITLE INPUT
  // ========================================

  test(
    "updates title input",
    () => {

      renderCreatePost();

      const titleInput =
        screen.getByPlaceholderText(
          "Enter title here"
        );

      fireEvent.change(
        titleInput,
        {
          target: {
            value: validTitle,
          },
        }
      );

      expect(
        titleInput.value
      ).toBe(validTitle);

    }
  );


  // ========================================
  // CONTENT INPUT
  // ========================================

  test(
    "updates content input",
    () => {

      renderCreatePost();

      const contentInput =
        screen.getByPlaceholderText(
          "Enter content here"
        );

      fireEvent.change(
        contentInput,
        {
          target: {
            value: validContent,
          },
        }
      );

      expect(
        contentInput.value
      ).toBe(validContent);

    }
  );


  // ========================================
  // CHARACTER COUNT
  // ========================================

  test(
    "updates character counter",
    () => {

      renderCreatePost();

      const contentInput =
        screen.getByPlaceholderText(
          "Enter content here"
        );

      fireEvent.change(
        contentInput,
        {
          target: {
            value: "Hello",
          },
        }
      );

      expect(
        screen.getByText(
          "5 / 500 characters (Min 100)"
        )
      ).toBeInTheDocument();

    }
  );


  // ========================================
  // BUTTON NOT VISIBLE INITIALLY
  // ========================================

  test(
    "does not show Create Post button initially",
    () => {

      renderCreatePost();

      expect(
        screen.queryByRole(
          "button",
          {
            name: "Create Post",
          }
        )
      ).not.toBeInTheDocument();

    }
  );


  // ========================================
  // BUTTON APPEARS
  // ========================================

  test(
    "shows Create Post button when title and content are entered",
    () => {

      renderCreatePost();

      const titleInput =
        screen.getByPlaceholderText(
          "Enter title here"
        );

      const contentInput =
        screen.getByPlaceholderText(
          "Enter content here"
        );

      fireEvent.change(
        titleInput,
        {
          target: {
            value: validTitle,
          },
        }
      );

      fireEvent.change(
        contentInput,
        {
          target: {
            value: validContent,
          },
        }
      );

      expect(
        screen.getByRole(
          "button",
          {
            name: "Create Post",
          }
        )
      ).toBeInTheDocument();

    }
  );


  // ========================================
  // EMPTY VALIDATION
  // ========================================

  test(
    "shows error when fields are empty",
    async () => {

      renderCreatePost();

      // The button is normally hidden when
      // fields are empty, so call the validation
      // indirectly by entering whitespace.

      const titleInput =
        screen.getByPlaceholderText(
          "Enter title here"
        );

      const contentInput =
        screen.getByPlaceholderText(
          "Enter content here"
        );

      fireEvent.change(
        titleInput,
        {
          target: {
            value: " ",
          },
        }
      );

      fireEvent.change(
        contentInput,
        {
          target: {
            value: " ",
          },
        }
      );

      // Button remains hidden because trim()
      // returns an empty string.

      expect(
        screen.queryByRole(
          "button",
          {
            name: "Create Post",
          }
        )
      ).not.toBeInTheDocument();

    }
  );


  // ========================================
  // CONTENT MINIMUM LENGTH
  // ========================================

  test(
    "shows error when content is less than 100 characters",
    async () => {

      renderCreatePost();

      const titleInput =
        screen.getByPlaceholderText(
          "Enter title here"
        );

      const contentInput =
        screen.getByPlaceholderText(
          "Enter content here"
        );

      fireEvent.change(
        titleInput,
        {
          target: {
            value: validTitle,
          },
        }
      );

      const shortContent =
        "This content is too short.";

      fireEvent.change(
        contentInput,
        {
          target: {
            value: shortContent,
          },
        }
      );

      const button =
        screen.getByRole(
          "button",
          {
            name: "Create Post",
          }
        );

      fireEvent.click(button);

      await waitFor(() => {

        expect(
          toast.error
        ).toHaveBeenCalledWith(
          "Content must be at least 100 characters"
        );

      });

      expect(
        axios.post
      ).not.toHaveBeenCalled();

    }
  );


  // ========================================
  // SUCCESSFUL POST
  // ========================================

  test(
    "creates post successfully",
    async () => {

      const createdPost = {
        id: 1,
        title: validTitle,
        content: validContent,
        author: "shakthi",
      };

      axios.post.mockResolvedValue({
        data: createdPost,
      });

      renderCreatePost();

      const titleInput =
        screen.getByPlaceholderText(
          "Enter title here"
        );

      const contentInput =
        screen.getByPlaceholderText(
          "Enter content here"
        );

      fireEvent.change(
        titleInput,
        {
          target: {
            value: validTitle,
          },
        }
      );

      fireEvent.change(
        contentInput,
        {
          target: {
            value: validContent,
          },
        }
      );

      const button =
        screen.getByRole(
          "button",
          {
            name: "Create Post",
          }
        );

      fireEvent.click(button);

      await waitFor(() => {

        expect(
          axios.post
        ).toHaveBeenCalledWith(

          "http://localhost:8083/api/posts",

          {
            title: validTitle,
            content: validContent,
          },

          {
            withCredentials: true,
          }

        );

      });

    }
  );


  // ========================================
  // SET POST
  // ========================================

  test(
    "updates context post after successful creation",
    async () => {

      const createdPost = {
        id: 1,
        title: validTitle,
        content: validContent,
        author: "shakthi",
      };

      axios.post.mockResolvedValue({
        data: createdPost,
      });

      renderCreatePost();

      fireEvent.change(
        screen.getByPlaceholderText(
          "Enter title here"
        ),
        {
          target: {
            value: validTitle,
          },
        }
      );

      fireEvent.change(
        screen.getByPlaceholderText(
          "Enter content here"
        ),
        {
          target: {
            value: validContent,
          },
        }
      );

      fireEvent.click(
        screen.getByRole(
          "button",
          {
            name: "Create Post",
          }
        )
      );

      await waitFor(() => {

        expect(
          setPost
        ).toHaveBeenCalledWith(
          createdPost
        );

      });

    }
  );


  // ========================================
  // SUCCESS TOAST
  // ========================================

  test(
    "shows success toast after creating post",
    async () => {

      axios.post.mockResolvedValue({
        data: {
          id: 1,
          title: validTitle,
          content: validContent,
        },
      });

      renderCreatePost();

      fireEvent.change(
        screen.getByPlaceholderText(
          "Enter title here"
        ),
        {
          target: {
            value: validTitle,
          },
        }
      );

      fireEvent.change(
        screen.getByPlaceholderText(
          "Enter content here"
        ),
        {
          target: {
            value: validContent,
          },
        }
      );

      fireEvent.click(
        screen.getByRole(
          "button",
          {
            name: "Create Post",
          }
        )
      );

      await waitFor(() => {

        expect(
          toast.success
        ).toHaveBeenCalledWith(
          "Post created successfully"
        );

      });

    }
  );


  // ========================================
  // NAVIGATION
  // ========================================

  test(
    "navigates to home after successful post creation",
    async () => {

      axios.post.mockResolvedValue({
        data: {
          id: 1,
          title: validTitle,
          content: validContent,
        },
      });

      renderCreatePost();

      fireEvent.change(
        screen.getByPlaceholderText(
          "Enter title here"
        ),
        {
          target: {
            value: validTitle,
          },
        }
      );

      fireEvent.change(
        screen.getByPlaceholderText(
          "Enter content here"
        ),
        {
          target: {
            value: validContent,
          },
        }
      );

      fireEvent.click(
        screen.getByRole(
          "button",
          {
            name: "Create Post",
          }
        )
      );

      await waitFor(() => {

        expect(
          mockNavigate
        ).toHaveBeenCalledWith("/");

      });

    }
  );


  // ========================================
  // RESET FORM
  // ========================================

  test(
    "clears title and content after successful creation",
    async () => {

      axios.post.mockResolvedValue({
        data: {
          id: 1,
          title: validTitle,
          content: validContent,
        },
      });

      renderCreatePost();

      const titleInput =
        screen.getByPlaceholderText(
          "Enter title here"
        );

      const contentInput =
        screen.getByPlaceholderText(
          "Enter content here"
        );

      fireEvent.change(
        titleInput,
        {
          target: {
            value: validTitle,
          },
        }
      );

      fireEvent.change(
        contentInput,
        {
          target: {
            value: validContent,
          },
        }
      );

      fireEvent.click(
        screen.getByRole(
          "button",
          {
            name: "Create Post",
          }
        )
      );

      await waitFor(() => {

        expect(
          titleInput.value
        ).toBe("");

        expect(
          contentInput.value
        ).toBe("");

      });

    }
  );


  // ========================================
  // 401 ERROR
  // ========================================

  test(
    "shows login error when API returns 401",
    async () => {

      axios.post.mockRejectedValue({
        response: {
          status: 401,
          data: {
            message:
              "Unauthorized",
          },
        },
      });

      renderCreatePost();

      fireEvent.change(
        screen.getByPlaceholderText(
          "Enter title here"
        ),
        {
          target: {
            value: validTitle,
          },
        }
      );

      fireEvent.change(
        screen.getByPlaceholderText(
          "Enter content here"
        ),
        {
          target: {
            value: validContent,
          },
        }
      );

      fireEvent.click(
        screen.getByRole(
          "button",
          {
            name: "Create Post",
          }
        )
      );

      await waitFor(() => {

        expect(
          toast.error
        ).toHaveBeenCalledWith(
          "Please login first"
        );

      });

    }
  );


  // ========================================
  // GENERAL API ERROR
  // ========================================

  test(
    "shows general error when API fails",
    async () => {

      axios.post.mockRejectedValue({
        response: {
          status: 500,
          data: {
            message:
              "Internal server error",
          },
        },
      });

      renderCreatePost();

      fireEvent.change(
        screen.getByPlaceholderText(
          "Enter title here"
        ),
        {
          target: {
            value: validTitle,
          },
        }
      );

      fireEvent.change(
        screen.getByPlaceholderText(
          "Enter content here"
        ),
        {
          target: {
            value: validContent,
          },
        }
      );

      fireEvent.click(
        screen.getByRole(
          "button",
          {
            name: "Create Post",
          }
        )
      );

      await waitFor(() => {

        expect(
          toast.error
        ).toHaveBeenCalledWith(
          "Error creating post"
        );

      });

    }
  );


  // ========================================
  // LOADING STATE
  // ========================================

  test(
    "shows Posting while request is in progress",
    async () => {

      let resolveRequest;

      axios.post.mockReturnValue(
        new Promise((resolve) => {

          resolveRequest = resolve;

        })
      );

      renderCreatePost();

      fireEvent.change(
        screen.getByPlaceholderText(
          "Enter title here"
        ),
        {
          target: {
            value: validTitle,
          },
        }
      );

      fireEvent.change(
        screen.getByPlaceholderText(
          "Enter content here"
        ),
        {
          target: {
            value: validContent,
          },
        }
      );

      fireEvent.click(
        screen.getByRole(
          "button",
          {
            name: "Create Post",
          }
        )
      );

      expect(
        screen.getByRole(
          "button",
          {
            name: "Posting...",
          }
        )
      ).toBeDisabled();

      resolveRequest({
        data: {
          id: 1,
          title: validTitle,
          content: validContent,
        },
      });

      await waitFor(() => {

        expect(
          mockNavigate
        ).toHaveBeenCalledWith("/");

      });

    }
  );

});