import { describe, test, expect, vi, beforeEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import UserPost from "./UserPost";

import { userDataContext } from "../context/DataContext.jsx";
import axios from "axios";
import toast from "react-hot-toast";


// ==========================================
// MOCK AXIOS
// ==========================================

vi.mock("axios", () => ({
  default: {
    delete: vi.fn(),
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

  const actual = await vi.importActual("react-router-dom");

  return {
    ...actual,

    useNavigate: () => mockNavigate,
  };
});


// ==========================================
// TEST DATA
// ==========================================

const mockPost = {
  id: 1,
  title: "My First Post",
  content: "This is my first blog post.",
};


// ==========================================
// RENDER HELPER
// ==========================================

const renderUserPost = (
  post = mockPost,
  setPost = vi.fn()
) => {

  return render(

    <MemoryRouter>

      <userDataContext.Provider
        value={{
          serverUrl: "http://localhost:8083",
        }}
      >

        <UserPost
          post={post}
          setPost={setPost}
        />

      </userDataContext.Provider>

    </MemoryRouter>

  );
};


// ==========================================
// TESTS
// ==========================================

describe("UserPost Component", () => {

  beforeEach(() => {

    vi.clearAllMocks();

  });


  // ========================================
  // RENDERING
  // ========================================

  test("renders post title", () => {

    renderUserPost();

    expect(
      screen.getByText("My First Post")
    ).toBeInTheDocument();

  });


  test("renders post content", () => {

    renderUserPost();

    expect(
      screen.getByText(
        "This is my first blog post."
      )
    ).toBeInTheDocument();

  });


  test("renders Edit button", () => {

    renderUserPost();

    expect(
      screen.getByRole("button", {
        name: "Edit",
      })
    ).toBeInTheDocument();

  });


  test("renders Delete button", () => {

    renderUserPost();

    expect(
      screen.getByRole("button", {
        name: "Delete",
      })
    ).toBeInTheDocument();

  });


  // ========================================
  // EDIT
  // ========================================

  test("navigates to edit page when Edit is clicked", () => {

    renderUserPost();

    const editButton =
      screen.getByRole("button", {
        name: "Edit",
      });

    fireEvent.click(editButton);

    expect(mockNavigate).toHaveBeenCalledWith(
      "/edit-post/1"
    );

  });


  // ========================================
  // DELETE
  // ========================================

  test("calls delete API when Delete is clicked", async () => {

    axios.delete.mockResolvedValue({
      data: {
        message: "Post deleted",
      },
    });

    renderUserPost();

    const deleteButton =
      screen.getByRole("button", {
        name: "Delete",
      });

    fireEvent.click(deleteButton);

    await waitFor(() => {

      expect(axios.delete).toHaveBeenCalledWith(
        "http://localhost:8083/api/posts/1",
        {
          withCredentials: true,
        }
      );

    });

  });


  test("shows success toast after deleting post", async () => {

    axios.delete.mockResolvedValue({
      data: {
        message: "Post deleted",
      },
    });

    renderUserPost();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Delete",
      })
    );

    await waitFor(() => {

      expect(toast.success).toHaveBeenCalledWith(
        "Post deleted"
      );

    });

  });


  // ========================================
  // REMOVE POST FROM UI
  // ========================================

  test("removes deleted post from state", async () => {

    axios.delete.mockResolvedValue({});

    const setPost = vi.fn();

    renderUserPost(
      mockPost,
      setPost
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Delete",
      })
    );

    await waitFor(() => {

      expect(setPost).toHaveBeenCalled();

    });

    // Get the callback passed to setPost
    const updateFunction =
      setPost.mock.calls[0][0];

    const oldPosts = [
      {
        id: 1,
        title: "My First Post",
      },
      {
        id: 2,
        title: "Another Post",
      },
    ];

    const result =
      updateFunction(oldPosts);

    expect(result).toEqual([
      {
        id: 2,
        title: "Another Post",
      },
    ]);

  });


  // ========================================
  // DELETE ERROR
  // ========================================

  test("shows error toast when delete fails", async () => {

    axios.delete.mockRejectedValue({
      response: {
        data: {
          message: "Delete failed",
        },
      },
    });

    renderUserPost();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Delete",
      })
    );

    await waitFor(() => {

      expect(toast.error).toHaveBeenCalledWith(
        "Delete error"
      );

    });

  });


  // ========================================
  // POST ID
  // ========================================

  test("uses correct post id for edit navigation", () => {

    const post = {
      id: 25,
      title: "Testing Post",
      content: "Testing content",
    };

    renderUserPost(post);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Edit",
      })
    );

    expect(mockNavigate).toHaveBeenCalledWith(
      "/edit-post/25"
    );

  });


  test("uses correct post id for delete API", async () => {

    axios.delete.mockResolvedValue({});

    const post = {
      id: 25,
      title: "Testing Post",
      content: "Testing content",
    };

    renderUserPost(post);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Delete",
      })
    );

    await waitFor(() => {

      expect(axios.delete).toHaveBeenCalledWith(
        "http://localhost:8083/api/posts/25",
        {
          withCredentials: true,
        }
      );

    });

  });

});