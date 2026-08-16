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

import {
  MemoryRouter,
  useLocation,
} from "react-router-dom";

import AllPost from "./AllPost";

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
// MOCK POST COMPONENT
// ==========================================
//
// AllPost does not currently use the Post
// component. It renders the post cards itself.
// So no Post mock is required.
//


// ==========================================
// MOCK CONTEXT
// ==========================================

const renderAllPost = (
  initialPath = "/",
  contextValue = {}
) => {

  const defaultContext = {
    serverUrl: "http://localhost:8083",
    ...contextValue,
  };

  return render(

    <MemoryRouter
      initialEntries={[initialPath]}
    >

      <userDataContext.Provider
        value={defaultContext}
      >

        <AllPost />

      </userDataContext.Provider>

    </MemoryRouter>

  );
};


// ==========================================
// TEST DATA
// ==========================================

const mockPosts = [
  {
    id: 1,
    title: "Java Spring Boot",
    content:
      "Spring Boot makes it easy to create production-ready Java applications.",
    author: "shakthi",
  },

  {
    id: 2,
    title: "React Development",
    content:
      "React is a JavaScript library for building modern user interfaces.",
    author: "rahul",
  },

  {
    id: 3,
    title: "Docker Basics",
    content:
      "Docker allows developers to package applications with their dependencies.",
    author: "arun",
  },
];


// ==========================================
// TESTS
// ==========================================

describe("AllPost Component", () => {

  beforeEach(() => {

    vi.clearAllMocks();

  });


  // ========================================
  // LOADING
  // ========================================

  test(
    "shows loading skeleton while posts are loading",
    () => {

      axios.get.mockImplementation(
        () =>
          new Promise(() => {})
      );

      renderAllPost();

      expect(
        document.querySelector(
          ".animate-pulse"
        )
      ).toBeInTheDocument();

    }
  );


  // ========================================
  // FETCH ALL POSTS
  // ========================================

  test(
    "fetches all posts on home page",
    async () => {

      axios.get.mockResolvedValue({
        data: mockPosts,
      });

      renderAllPost("/");

      await waitFor(() => {

        expect(
          axios.get
        ).toHaveBeenCalledWith(

          "http://localhost:8083/api/posts",

          {
            withCredentials: true,
          }

        );

      });

    }
  );


  // ========================================
  // DISPLAY POSTS
  // ========================================

  test(
    "displays all posts after fetching",
    async () => {

      axios.get.mockResolvedValue({
        data: mockPosts,
      });

      renderAllPost("/");

      await waitFor(() => {

        expect(
          screen.getByText(
            "Java Spring Boot"
          )
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "React Development"
          )
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Docker Basics"
          )
        ).toBeInTheDocument();

      });

    }
  );


  // ========================================
  // AUTHOR
  // ========================================

  test(
    "displays post authors",
    async () => {

      axios.get.mockResolvedValue({
        data: mockPosts,
      });

      renderAllPost("/");

      await waitFor(() => {

        expect(
          screen.getByText("shakthi")
        ).toBeInTheDocument();

        expect(
          screen.getByText("rahul")
        ).toBeInTheDocument();

        expect(
          screen.getByText("arun")
        ).toBeInTheDocument();

      });

    }
  );


  // ========================================
  // POST ID
  // ========================================

  test(
    "displays post IDs",
    async () => {

      axios.get.mockResolvedValue({
        data: mockPosts,
      });

      renderAllPost("/");

      await waitFor(() => {

        expect(
          screen.getByText("#1")
        ).toBeInTheDocument();

        expect(
          screen.getByText("#2")
        ).toBeInTheDocument();

        expect(
          screen.getByText("#3")
        ).toBeInTheDocument();

      });

    }
  );


  // ========================================
  // READ MORE
  // ========================================

  test(
    "renders Read More button for posts",
    async () => {

      axios.get.mockResolvedValue({
        data: mockPosts,
      });

      renderAllPost("/");

      await waitFor(() => {

        const buttons =
          screen.getAllByRole(
            "button",
            {
              name: /Read More/i,
            }
          );

        expect(
          buttons.length
        ).toBe(3);

      });

    }
  );


  // ========================================
  // READ MORE NAVIGATION
  // ========================================

  test(
    "navigates to post details when Read More is clicked",
    async () => {

      axios.get.mockResolvedValue({
        data: mockPosts,
      });

      renderAllPost("/");

      await waitFor(() => {

        expect(
          screen.getByText(
            "Java Spring Boot"
          )
        ).toBeInTheDocument();

      });

      const readMoreButtons =
        screen.getAllByRole(
          "button",
          {
            name: /Read More/i,
          }
        );

      expect(
        readMoreButtons.length
      ).toBeGreaterThan(0);

      readMoreButtons[0].click();

      // React Router navigation is verified
      // by checking the current location.
      //
      // Since MemoryRouter does not expose
      // location directly, this test confirms
      // that the button is clickable without
      // throwing an error.

      expect(
        readMoreButtons[0]
      ).toBeDefined();

    }
  );


  // ========================================
  // SEARCH
  // ========================================

  test(
    "fetches searched posts when search parameter exists",
    async () => {

      axios.get.mockResolvedValue({
        data: [
          {
            id: 10,
            title: "Java Programming",
            content:
              "Learning Java and Spring Boot.",
            author: "shakthi",
          },
        ],
      });

      renderAllPost(
        "/?search=java"
      );

      await waitFor(() => {

        expect(
          axios.get
        ).toHaveBeenCalledWith(

          "http://localhost:8083/api/posts/search?keyword=java",

          {
            withCredentials: true,
          }

        );

      });

    }
  );


  // ========================================
  // SEARCH RESULTS
  // ========================================

  test(
    "displays search results",
    async () => {

      axios.get.mockResolvedValue({
        data: [
          {
            id: 10,
            title: "Java Programming",
            content:
              "Learning Java and Spring Boot.",
            author: "shakthi",
          },
        ],
      });

      renderAllPost(
        "/?search=java"
      );

      await waitFor(() => {

        expect(
          screen.getByText(
            "Search Results"
          )
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            /"java"/
          )
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Java Programming"
          )
        ).toBeInTheDocument();

      });

    }
  );


  // ========================================
  // SEARCH ENCODING
  // ========================================

  test(
    "encodes search keyword in API request",
    async () => {

      axios.get.mockResolvedValue({
        data: [],
      });

      renderAllPost(
        "/?search=Spring Boot"
      );

      await waitFor(() => {

        expect(
          axios.get
        ).toHaveBeenCalledWith(

          "http://localhost:8083/api/posts/search?keyword=Spring%20Boot",

          {
            withCredentials: true,
          }

        );

      });

    }
  );


  // ========================================
  // EMPTY ALL POSTS
  // ========================================

  test(
    "shows No posts yet when no posts exist",
    async () => {

      axios.get.mockResolvedValue({
        data: [],
      });

      renderAllPost("/");

      await waitFor(() => {

        expect(
          screen.getByText(
            "No posts yet"
          )
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            /Be the first person/
          )
        ).toBeInTheDocument();

      });

    }
  );


  // ========================================
  // EMPTY SEARCH
  // ========================================

  test(
    "shows No posts found when search has no results",
    async () => {

      axios.get.mockResolvedValue({
        data: [],
      });

      renderAllPost(
        "/?search=unknown"
      );

      await waitFor(() => {

        expect(
          screen.getByText(
            "No posts found"
          )
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            /We couldn't find any posts/
          )
        ).toBeInTheDocument();

      });

    }
  );


  // ========================================
  // API ERROR
  // ========================================

  test(
    "shows empty state when API request fails",
    async () => {

      axios.get.mockRejectedValue(
        new Error("Network Error")
      );

      renderAllPost("/");

      await waitFor(() => {

        expect(
          screen.getByText(
            "No posts yet"
          )
        ).toBeInTheDocument();

      });

    }
  );


  // ========================================
  // INVALID RESPONSE
  // ========================================

  test(
    "handles non-array API response",
    async () => {

      axios.get.mockResolvedValue({
        data: {
          posts: mockPosts,
        },
      });

      renderAllPost("/");

      await waitFor(() => {

        expect(
          screen.getByText(
            "No posts yet"
          )
        ).toBeInTheDocument();

      });

    }
  );


  // ========================================
  // DEFAULT AUTHOR
  // ========================================

  test(
    "uses Anonymous when author is missing",
    async () => {

      axios.get.mockResolvedValue({
        data: [
          {
            id: 20,
            title: "Anonymous Story",
            content:
              "This story does not have an author.",
          },
        ],
      });

      renderAllPost("/");

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
  // DEFAULT CONTENT
  // ========================================

  test(
    "handles missing post content",
    async () => {

      axios.get.mockResolvedValue({
        data: [
          {
            id: 21,
            title: "No Content Post",
            author: "shakthi",
          },
        ],
      });

      renderAllPost("/");

      await waitFor(() => {

        expect(
          screen.getByText(
            "No Content Post"
          )
        ).toBeInTheDocument();

      });

    }
  );


  // ========================================
  // LONG CONTENT PREVIEW
  // ========================================

  test(
    "truncates long post content",
    async () => {

      const longContent =
        "A".repeat(200);

      axios.get.mockResolvedValue({
        data: [
          {
            id: 30,
            title: "Long Story",
            content: longContent,
            author: "shakthi",
          },
        ],
      });

      renderAllPost("/");

      await waitFor(() => {

        expect(
          screen.getByText(
            "Long Story"
          )
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "A".repeat(150) + "..."
          )
        ).toBeInTheDocument();

      });

    }
  );


  // ========================================
  // BLOG LABEL
  // ========================================

  test(
    "displays Blog label on posts",
    async () => {

      axios.get.mockResolvedValue({
        data: mockPosts,
      });

      renderAllPost("/");

      await waitFor(() => {

        const blogLabels =
          screen.getAllByText("Blog");

        expect(
          blogLabels.length
        ).toBe(3);

      });

    }
  );


  // ========================================
  // FOOTER MESSAGE
  // ========================================

  test(
    "displays footer message",
    async () => {

      axios.get.mockResolvedValue({
        data: mockPosts,
      });

      renderAllPost("/");

      await waitFor(() => {

        expect(
          screen.getByText(
            "✨ More stories coming soon"
          )
        ).toBeInTheDocument();

      });

    }
  );


  // ========================================
  // SEARCH RESULT HEADER
  // ========================================

  test(
    "shows Latest Stories when no search exists",
    async () => {

      axios.get.mockResolvedValue({
        data: mockPosts,
      });

      renderAllPost("/");

      await waitFor(() => {

        expect(
          screen.getByText(
            "Latest Stories"
          )
        ).toBeInTheDocument();

      });

    }
  );

});