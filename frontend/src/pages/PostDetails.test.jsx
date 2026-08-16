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
  fireEvent,
} from "@testing-library/react";

import { MemoryRouter } from "react-router-dom";

import PostDetails from "./PostDetails";

import {
  userDataContext,
} from "../context/DataContext.jsx";

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

    useParams: () => ({
      id: "1",
    }),
  };
});


// ==========================================
// TEST CONTEXT
// ==========================================

const renderPostDetails = (
  contextValue = {}
) => {

  const defaultContext = {
    serverUrl:
      "http://localhost:8083",

    ...contextValue,
  };

  return render(

    <MemoryRouter
      initialEntries={[
        "/post/1",
      ]}
    >

      <userDataContext.Provider
        value={defaultContext}
      >

        <PostDetails />

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
    "My First Blog Post",

  content:
    "This is my first blog post. It contains enough content to demonstrate the complete post details page.",

  author:
    "shakthi",
};


// ==========================================
// TESTS
// ==========================================

describe("PostDetails Component", () => {

  beforeEach(() => {

    vi.clearAllMocks();

  });


  // ========================================
  // LOADING
  // ========================================

  test(
    "shows loading state while fetching post",
    () => {

      axios.get.mockImplementation(
        () => new Promise(() => {})
      );

      renderPostDetails();

      expect(
        screen.getByText(
          "Loading post..."
        )
      ).toBeInTheDocument();

    }
  );


  // ========================================
  // API REQUEST
  // ========================================

  test(
    "fetches post using post ID",
    async () => {

      axios.get.mockResolvedValue({
        data: mockPost,
      });

      renderPostDetails();

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
  // LOADING DISAPPEARS
  // ========================================

  test(
    "removes loading state after post is loaded",
    async () => {

      axios.get.mockResolvedValue({
        data: mockPost,
      });

      renderPostDetails();

      await waitFor(() => {

        expect(
          screen.queryByText(
            "Loading post..."
          )
        ).not.toBeInTheDocument();

      });

    }
  );


  // ========================================
  // POST TITLE
  // ========================================

  test(
    "displays post title",
    async () => {

      axios.get.mockResolvedValue({
        data: mockPost,
      });

      renderPostDetails();

      await waitFor(() => {

        expect(
          screen.getByRole(
            "heading",
            {
              name:
                "My First Blog Post",
            }
          )
        ).toBeInTheDocument();

      });

    }
  );


  // ========================================
  // POST CONTENT
  // ========================================

  test(
    "displays post content",
    async () => {

      axios.get.mockResolvedValue({
        data: mockPost,
      });

      renderPostDetails();

      await waitFor(() => {

        expect(
          screen.getByText(
            mockPost.content
          )
        ).toBeInTheDocument();

      });

    }
  );


  // ========================================
  // AUTHOR
  // ========================================

  test(
    "displays post author",
    async () => {

      axios.get.mockResolvedValue({
        data: mockPost,
      });

      renderPostDetails();

      await waitFor(() => {

        expect(
          screen.getByText(
            "shakthi"
          )
        ).toBeInTheDocument();

      });

    }
  );


  // ========================================
  // AUTHOR INITIAL
  // ========================================

  test(
    "displays first letter of author",
    async () => {

      axios.get.mockResolvedValue({
        data: mockPost,
      });

      renderPostDetails();

      await waitFor(() => {

        expect(
          screen.getByText("S")
        ).toBeInTheDocument();

      });

    }
  );


  // ========================================
  // AUTHOR LABEL
  // ========================================

  test(
    "displays SparkNote Author label",
    async () => {

      axios.get.mockResolvedValue({
        data: mockPost,
      });

      renderPostDetails();

      await waitFor(() => {

        expect(
          screen.getByText(
            "SparkNote Author"
          )
        ).toBeInTheDocument();

      });

    }
  );


  // ========================================
  // POST ID
  // ========================================

  test(
    "displays post ID",
    async () => {

      axios.get.mockResolvedValue({
        data: mockPost,
      });

      renderPostDetails();

      await waitFor(() => {

        expect(
          screen.getByText(
            "Post #1"
          )
        ).toBeInTheDocument();

      });

    }
  );


  // ========================================
  // BACK BUTTON
  // ========================================

  test(
    "renders Back button",
    async () => {

      axios.get.mockResolvedValue({
        data: mockPost,
      });

      renderPostDetails();

      await waitFor(() => {

        expect(
          screen.getByRole(
            "button",
            {
              name: "← Back",
            }
          )
        ).toBeInTheDocument();

      });

    }
  );


  // ========================================
  // BACK BUTTON NAVIGATION
  // ========================================

  test(
    "navigates back when Back button is clicked",
    async () => {

      axios.get.mockResolvedValue({
        data: mockPost,
      });

      renderPostDetails();

      const backButton =
        await screen.findByRole(
          "button",
          {
            name: "← Back",
          }
        );

      fireEvent.click(
        backButton
      );

      expect(
        mockNavigate
      ).toHaveBeenCalledWith(-1);

    }
  );


  // ========================================
  // BACK TO HOME
  // ========================================

  test(
    "renders Back to Home button",
    async () => {

      axios.get.mockResolvedValue({
        data: mockPost,
      });

      renderPostDetails();

      await waitFor(() => {

        expect(
          screen.getByRole(
            "button",
            {
              name: "Back to Home",
            }
          )
        ).toBeInTheDocument();

      });

    }
  );


  // ========================================
  // BACK TO HOME NAVIGATION
  // ========================================

  test(
    "navigates to home when Back to Home is clicked",
    async () => {

      axios.get.mockResolvedValue({
        data: mockPost,
      });

      renderPostDetails();

      const button =
        await screen.findByRole(
          "button",
          {
            name: "Back to Home",
          }
        );

      fireEvent.click(
        button
      );

      expect(
        mockNavigate
      ).toHaveBeenCalledWith(
        "/"
      );

    }
  );


  // ========================================
  // POST NOT FOUND
  // ========================================

  test(
    "shows Post not found when API returns null",
    async () => {

      axios.get.mockResolvedValue({
        data: null,
      });

      renderPostDetails();

      await waitFor(() => {

        expect(
          screen.getByText(
            "Post not found"
          )
        ).toBeInTheDocument();

      });

    }
  );


  // ========================================
  // POST NOT FOUND MESSAGE
  // ========================================

  test(
    "shows post not found description",
    async () => {

      axios.get.mockResolvedValue({
        data: null,
      });

      renderPostDetails();

      await waitFor(() => {

        expect(
          screen.getByText(
            /This post may have been deleted/
          )
        ).toBeInTheDocument();

      });

    }
  );


  // ========================================
  // NOT FOUND BACK BUTTON
  // ========================================

  test(
    "shows Back to Posts button when post is not found",
    async () => {

      axios.get.mockResolvedValue({
        data: null,
      });

      renderPostDetails();

      await waitFor(() => {

        expect(
          screen.getByRole(
            "button",
            {
              name:
                "← Back to Posts",
            }
          )
        ).toBeInTheDocument();

      });

    }
  );


  // ========================================
  // NOT FOUND NAVIGATION
  // ========================================

  test(
    "navigates home from Post not found page",
    async () => {

      axios.get.mockResolvedValue({
        data: null,
      });

      renderPostDetails();

      const button =
        await screen.findByRole(
          "button",
          {
            name:
              "← Back to Posts",
          }
        );

      fireEvent.click(
        button
      );

      expect(
        mockNavigate
      ).toHaveBeenCalledWith(
        "/"
      );

    }
  );


  // ========================================
  // API ERROR
  // ========================================

  test(
    "shows Post not found when API request fails",
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

      renderPostDetails();

      await waitFor(() => {

        expect(
          screen.getByText(
            "Post not found"
          )
        ).toBeInTheDocument();

      });

    }
  );


  // ========================================
  // NETWORK ERROR
  // ========================================

  test(
    "handles network error",
    async () => {

      axios.get.mockRejectedValue(
        new Error("Network Error")
      );

      renderPostDetails();

      await waitFor(() => {

        expect(
          screen.getByText(
            "Post not found"
          )
        ).toBeInTheDocument();

      });

    }
  );


  // ========================================
  // AUTHOR FALLBACK
  // ========================================

  test(
    "uses Anonymous when author is missing",
    async () => {

      axios.get.mockResolvedValue({
        data: {
          ...mockPost,
          author: null,
        },
      });

      renderPostDetails();

      await waitFor(() => {

        expect(
          screen.getByText(
            "Anonymous"
          )
        ).toBeInTheDocument();

      });

    }
  );


  // ========================================
  // ANONYMOUS INITIAL
  // ========================================

  test(
    "uses A as initial for anonymous author",
    async () => {

      axios.get.mockResolvedValue({
        data: {
          ...mockPost,
          author: null,
        },
      });

      renderPostDetails();

      await waitFor(() => {

        expect(
          screen.getByText("A")
        ).toBeInTheDocument();

      });

    }
  );


  // ========================================
  // MISSING TITLE
  // ========================================

  test(
    "handles post with missing title",
    async () => {

      axios.get.mockResolvedValue({
        data: {
          ...mockPost,
          title: "",
        },
      });

      renderPostDetails();

      await waitFor(() => {

        expect(
          screen.getByText(
            "shakthi"
          )
        ).toBeInTheDocument();

      });

    }
  );


  // ========================================
  // MISSING CONTENT
  // ========================================

  test(
    "handles post with missing content",
    async () => {

      axios.get.mockResolvedValue({
        data: {
          ...mockPost,
          content: "",
        },
      });

      renderPostDetails();

      await waitFor(() => {

        expect(
          screen.getByText(
            "Post #1"
          )
        ).toBeInTheDocument();

      });

    }
  );


  // ========================================
  // SERVER URL
  // ========================================

  test(
    "uses serverUrl from context",
    async () => {

      axios.get.mockResolvedValue({
        data: mockPost,
      });

      renderPostDetails({
        serverUrl:
          "http://localhost:9000",
      });

      await waitFor(() => {

        expect(
          axios.get
        ).toHaveBeenCalledWith(

          "http://localhost:9000/api/posts/1",

          {
            withCredentials: true,
          }

        );

      });

    }
  );


  // ========================================
  // CREDENTIALS
  // ========================================

  test(
    "sends request with credentials",
    async () => {

      axios.get.mockResolvedValue({
        data: mockPost,
      });

      renderPostDetails();

      await waitFor(() => {

        expect(
          axios.get
        ).toHaveBeenCalledWith(

          expect.any(String),

          {
            withCredentials: true,
          }

        );

      });

    }
  );


  // ========================================
  // NO REQUEST WITHOUT SERVER URL
  // ========================================

  test(
    "does not fetch post when serverUrl is missing",
    async () => {

      renderPostDetails({
        serverUrl: "",
      });

      await new Promise(
        (resolve) =>
          setTimeout(resolve, 50)
      );

      expect(
        axios.get
      ).not.toHaveBeenCalled();

    }
  );

});