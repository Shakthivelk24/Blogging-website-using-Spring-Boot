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

import EditPost from "./EditPost";

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
    get: vi.fn(),
    put: vi.fn(),
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
// MOCK REACT ROUTER
// ==========================================

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {

  const actual = await vi.importActual(
    "react-router-dom"
  );

  return {
    ...actual,

    useNavigate: () => mockNavigate,

    useParams: () => ({
      id: "1",
    }),
  };
});


// ==========================================
// TEST CONTEXT
// ==========================================

const renderEditPost = () => {

  return render(

    <MemoryRouter
      initialEntries={["/edit-post/1"]}
    >

      <userDataContext.Provider
        value={{
          serverUrl:
            "http://localhost:8083",

          post: null,

          setPost: vi.fn(),

          userData: {
            username: "shakthi",
          },
        }}
      >

        <EditPost />

      </userDataContext.Provider>

    </MemoryRouter>

  );
};


// ==========================================
// TEST DATA
// ==========================================

const mockPost = {
  id: 1,

  title:
    "My Existing Blog Post",

  content:
    "This is an existing blog post with enough content to satisfy the minimum one hundred character validation requirement when updating the post.",

  author:
    "shakthi",
};

const updatedTitle =
  "Updated Blog Post";

const updatedContent =
  "This is the updated content of my blog post. It contains more than one hundred characters so that it satisfies the validation requirement of the EditPost component.";


// ==========================================
// TESTS
// ==========================================

describe("EditPost Component", () => {

  beforeEach(() => {

    vi.clearAllMocks();

  });


  // ========================================
  // FETCH POST
  // ========================================

  test(
    "fetches post by ID when component loads",
    async () => {

      axios.get.mockResolvedValue({
        data: mockPost,
      });

      renderEditPost();

      await waitFor(() => {

        expect(
          axios.get
        ).toHaveBeenCalledWith(

          "http://localhost:8083/api/posts/1",

          {
            withCredentials: true,
          }

        );

      });

    }
  );


  // ========================================
  // LOAD POST DATA
  // ========================================

  test(
    "loads existing title into input",
    async () => {

      axios.get.mockResolvedValue({
        data: mockPost,
      });

      renderEditPost();

      const titleInput =
        await screen.findByDisplayValue(
          "My Existing Blog Post"
        );

      expect(
        titleInput
      ).toBeInTheDocument();

    }
  );


  test(
    "loads existing content into textarea",
    async () => {

      axios.get.mockResolvedValue({
        data: mockPost,
      });

      renderEditPost();

      const contentInput =
        await screen.findByDisplayValue(
          mockPost.content
        );

      expect(
        contentInput
      ).toBeInTheDocument();

    }
  );


  // ========================================
  // FORM RENDERING
  // ========================================

  test(
    "renders title and content fields",
    async () => {

      axios.get.mockResolvedValue({
        data: mockPost,
      });

      renderEditPost();

      expect(
        screen.getByText("Title")
      ).toBeInTheDocument();

      expect(
        screen.getByText("Content")
      ).toBeInTheDocument();

      expect(
        screen.getByRole(
          "button",
          {
            name: "Save",
          }
        )
      ).toBeInTheDocument();

      expect(
        screen.getByRole(
          "button",
          {
            name: "Cancel",
          }
        )
      ).toBeInTheDocument();

    }
  );


  // ========================================
  // CHARACTER COUNTER
  // ========================================

  test(
    "displays content character count",
    async () => {

      axios.get.mockResolvedValue({
        data: mockPost,
      });

      renderEditPost();

      await waitFor(() => {

        expect(
          screen.getByText(
            `${mockPost.content.length} / 500 characters`
          )
        ).toBeInTheDocument();

      });

    }
  );


  // ========================================
  // TITLE CHANGE
  // ========================================

  test(
    "allows title to be edited",
    async () => {

      axios.get.mockResolvedValue({
        data: mockPost,
      });

      renderEditPost();

      const titleInput =
        await screen.findByDisplayValue(
          "My Existing Blog Post"
        );

      fireEvent.change(
        titleInput,
        {
          target: {
            value: updatedTitle,
          },
        }
      );

      expect(
        titleInput.value
      ).toBe(updatedTitle);

    }
  );


  // ========================================
  // CONTENT CHANGE
  // ========================================

  test(
    "allows content to be edited",
    async () => {

      axios.get.mockResolvedValue({
        data: mockPost,
      });

      renderEditPost();

      const contentInput =
        await screen.findByDisplayValue(
          mockPost.content
        );

      fireEvent.change(
        contentInput,
        {
          target: {
            value: updatedContent,
          },
        }
      );

      expect(
        contentInput.value
      ).toBe(updatedContent);

    }
  );


  // ========================================
  // EMPTY VALIDATION
  // ========================================

  test(
    "shows error when title is empty",
    async () => {

      axios.get.mockResolvedValue({
        data: mockPost,
      });

      renderEditPost();

      const titleInput =
        await screen.findByDisplayValue(
          "My Existing Blog Post"
        );

      fireEvent.change(
        titleInput,
        {
          target: {
            value: "",
          },
        }
      );

      fireEvent.click(
        screen.getByRole(
          "button",
          {
            name: "Save",
          }
        )
      );

      expect(
        toast.error
      ).toHaveBeenCalledWith(
        "Please fill all fields"
      );

      expect(
        axios.put
      ).not.toHaveBeenCalled();

    }
  );


  test(
    "shows error when content is empty",
    async () => {

      axios.get.mockResolvedValue({
        data: mockPost,
      });

      renderEditPost();

      const contentInput =
        await screen.findByDisplayValue(
          mockPost.content
        );

      fireEvent.change(
        contentInput,
        {
          target: {
            value: "",
          },
        }
      );

      fireEvent.click(
        screen.getByRole(
          "button",
          {
            name: "Save",
          }
        )
      );

      expect(
        toast.error
      ).toHaveBeenCalledWith(
        "Please fill all fields"
      );

      expect(
        axios.put
      ).not.toHaveBeenCalled();

    }
  );


  // ========================================
  // MINIMUM CONTENT VALIDATION
  // ========================================

  test(
    "shows error when content is less than 100 characters",
    async () => {

      axios.get.mockResolvedValue({
        data: mockPost,
      });

      renderEditPost();

      const contentInput =
        await screen.findByDisplayValue(
          mockPost.content
        );

      fireEvent.change(
        contentInput,
        {
          target: {
            value:
              "This content is too short.",
          },
        }
      );

      fireEvent.click(
        screen.getByRole(
          "button",
          {
            name: "Save",
          }
        )
      );

      expect(
        toast.error
      ).toHaveBeenCalledWith(
        "Content must be at least 100 characters"
      );

      expect(
        axios.put
      ).not.toHaveBeenCalled();

    }
  );


  // ========================================
  // UPDATE POST
  // ========================================

  test(
    "updates post successfully",
    async () => {

      axios.get.mockResolvedValue({
        data: mockPost,
      });

      axios.put.mockResolvedValue({
        data: {
          ...mockPost,
          title: updatedTitle,
          content: updatedContent,
        },
      });

      renderEditPost();

      const titleInput =
        await screen.findByDisplayValue(
          "My Existing Blog Post"
        );

      const contentInput =
        await screen.findByDisplayValue(
          mockPost.content
        );

      fireEvent.change(
        titleInput,
        {
          target: {
            value: updatedTitle,
          },
        }
      );

      fireEvent.change(
        contentInput,
        {
          target: {
            value: updatedContent,
          },
        }
      );

      fireEvent.click(
        screen.getByRole(
          "button",
          {
            name: "Save",
          }
        )
      );

      await waitFor(() => {

        expect(
          axios.put
        ).toHaveBeenCalledWith(

          "http://localhost:8083/api/posts/1",

          {
            title: updatedTitle,
            content: updatedContent,
          },

          {
            withCredentials: true,
          }

        );

      });

    }
  );


  // ========================================
  // SUCCESS TOAST
  // ========================================

  test(
    "shows success toast after update",
    async () => {

      axios.get.mockResolvedValue({
        data: mockPost,
      });

      axios.put.mockResolvedValue({
        data: {
          ...mockPost,
          title: updatedTitle,
          content: updatedContent,
        },
      });

      renderEditPost();

      const titleInput =
        await screen.findByDisplayValue(
          "My Existing Blog Post"
        );

      const contentInput =
        await screen.findByDisplayValue(
          mockPost.content
        );

      fireEvent.change(
        titleInput,
        {
          target: {
            value: updatedTitle,
          },
        }
      );

      fireEvent.change(
        contentInput,
        {
          target: {
            value: updatedContent,
          },
        }
      );

      fireEvent.click(
        screen.getByRole(
          "button",
          {
            name: "Save",
          }
        )
      );

      await waitFor(() => {

        expect(
          toast.success
        ).toHaveBeenCalledWith(
          "Post updated successfully"
        );

      });

    }
  );


  // ========================================
  // NAVIGATION AFTER UPDATE
  // ========================================

  test(
    "navigates to My Posts after successful update",
    async () => {

      axios.get.mockResolvedValue({
        data: mockPost,
      });

      axios.put.mockResolvedValue({
        data: {
          ...mockPost,
          title: updatedTitle,
          content: updatedContent,
        },
      });

      renderEditPost();

      const titleInput =
        await screen.findByDisplayValue(
          "My Existing Blog Post"
        );

      const contentInput =
        await screen.findByDisplayValue(
          mockPost.content
        );

      fireEvent.change(
        titleInput,
        {
          target: {
            value: updatedTitle,
          },
        }
      );

      fireEvent.change(
        contentInput,
        {
          target: {
            value: updatedContent,
          },
        }
      );

      fireEvent.click(
        screen.getByRole(
          "button",
          {
            name: "Save",
          }
        )
      );

      await waitFor(() => {

        expect(
          mockNavigate
        ).toHaveBeenCalledWith(
          "/mypost"
        );

      });

    }
  );


  // ========================================
  // 401 UPDATE ERROR
  // ========================================

  test(
    "shows login error when update returns 401",
    async () => {

      axios.get.mockResolvedValue({
        data: mockPost,
      });

      axios.put.mockRejectedValue({
        response: {
          status: 401,
          data: {
            message:
              "Unauthorized",
          },
        },
      });

      renderEditPost();

      const titleInput =
        await screen.findByDisplayValue(
          "My Existing Blog Post"
        );

      const contentInput =
        await screen.findByDisplayValue(
          mockPost.content
        );

      fireEvent.change(
        titleInput,
        {
          target: {
            value: updatedTitle,
          },
        }
      );

      fireEvent.change(
        contentInput,
        {
          target: {
            value: updatedContent,
          },
        }
      );

      fireEvent.click(
        screen.getByRole(
          "button",
          {
            name: "Save",
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
  // 403 UPDATE ERROR
  // ========================================

  test(
    "shows permission error when update returns 403",
    async () => {

      axios.get.mockResolvedValue({
        data: mockPost,
      });

      axios.put.mockRejectedValue({
        response: {
          status: 403,
          data: {
            message:
              "Forbidden",
          },
        },
      });

      renderEditPost();

      const titleInput =
        await screen.findByDisplayValue(
          "My Existing Blog Post"
        );

      const contentInput =
        await screen.findByDisplayValue(
          mockPost.content
        );

      fireEvent.change(
        titleInput,
        {
          target: {
            value: updatedTitle,
          },
        }
      );

      fireEvent.change(
        contentInput,
        {
          target: {
            value: updatedContent,
          },
        }
      );

      fireEvent.click(
        screen.getByRole(
          "button",
          {
            name: "Save",
          }
        )
      );

      await waitFor(() => {

        expect(
          toast.error
        ).toHaveBeenCalledWith(
          "You cannot edit this post"
        );

      });

    }
  );


  // ========================================
  // GENERAL UPDATE ERROR
  // ========================================

  test(
    "shows general error when update fails",
    async () => {

      axios.get.mockResolvedValue({
        data: mockPost,
      });

      axios.put.mockRejectedValue({
        response: {
          status: 500,
          data: {
            message:
              "Internal Server Error",
          },
        },
      });

      renderEditPost();

      const titleInput =
        await screen.findByDisplayValue(
          "My Existing Blog Post"
        );

      const contentInput =
        await screen.findByDisplayValue(
          mockPost.content
        );

      fireEvent.change(
        titleInput,
        {
          target: {
            value: updatedTitle,
          },
        }
      );

      fireEvent.change(
        contentInput,
        {
          target: {
            value: updatedContent,
          },
        }
      );

      fireEvent.click(
        screen.getByRole(
          "button",
          {
            name: "Save",
          }
        )
      );

      await waitFor(() => {

        expect(
          toast.error
        ).toHaveBeenCalledWith(
          "Error updating post"
        );

      });

    }
  );


  // ========================================
  // GET POST ERROR
  // ========================================

  test(
    "shows error when post cannot be loaded",
    async () => {

      axios.get.mockRejectedValue({
        response: {
          status: 404,
          data: {
            message:
              "Post not found",
          },
        },
      });

      renderEditPost();

      await waitFor(() => {

        expect(
          toast.error
        ).toHaveBeenCalledWith(
          "Unable to load post"
        );

      });

    }
  );


  // ========================================
  // CANCEL
  // ========================================

  test(
    "navigates to My Posts when Cancel is clicked",
    async () => {

      axios.get.mockResolvedValue({
        data: mockPost,
      });

      renderEditPost();

      await screen.findByDisplayValue(
        "My Existing Blog Post"
      );

      fireEvent.click(
        screen.getByRole(
          "button",
          {
            name: "Cancel",
          }
        )
      );

      expect(
        mockNavigate
      ).toHaveBeenCalledWith(
        "/mypost"
      );

    }
  );


  // ========================================
  // LOADING STATE
  // ========================================

  test(
    "shows Saving while update is in progress",
    async () => {

      axios.get.mockResolvedValue({
        data: mockPost,
      });

      let resolveUpdate;

      axios.put.mockReturnValue(
        new Promise((resolve) => {

          resolveUpdate = resolve;

        })
      );

      renderEditPost();

      const titleInput =
        await screen.findByDisplayValue(
          "My Existing Blog Post"
        );

      const contentInput =
        await screen.findByDisplayValue(
          mockPost.content
        );

      fireEvent.change(
        titleInput,
        {
          target: {
            value: updatedTitle,
          },
        }
      );

      fireEvent.change(
        contentInput,
        {
          target: {
            value: updatedContent,
          },
        }
      );

      fireEvent.click(
        screen.getByRole(
          "button",
          {
            name: "Save",
          }
        )
      );

      expect(
        screen.getByRole(
          "button",
          {
            name: "Saving..."
          }
        )
      ).toBeDisabled();

      expect(
        screen.getByRole(
          "button",
          {
            name: "Cancel"
          }
        )
      ).toBeDisabled();

      resolveUpdate({
        data: {
          ...mockPost,
          title: updatedTitle,
          content: updatedContent,
        },
      });

      await waitFor(() => {

        expect(
          mockNavigate
        ).toHaveBeenCalledWith(
          "/mypost"
        );

      });

    }
  );

});