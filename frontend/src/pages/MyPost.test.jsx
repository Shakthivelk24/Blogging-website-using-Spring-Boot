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

import { MemoryRouter } from "react-router-dom";

import MyPost from "./MyPost";

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
// MOCK USERPOST
// ==========================================

vi.mock("../components/UserPost", () => ({

  default: ({ post }) => (

    <div data-testid="user-post">

      <h2>
        {post.title}
      </h2>

      <p>
        {post.content}
      </p>

      <span>
        {post.author}
      </span>

    </div>

  ),

}));


// ==========================================
// TEST DATA
// ==========================================

const mockPosts = [

  {
    id: 1,

    title:
      "My First Post",

    content:
      "This is my first blog post with enough content.",

    author:
      "shakthi",
  },

  {
    id: 2,

    title:
      "My Second Post",

    content:
      "This is my second blog post with enough content.",

    author:
      "shakthi",
  },

];


// ==========================================
// RENDER HELPER
// ==========================================

const renderMyPost = (
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

        <MyPost />

      </userDataContext.Provider>

    </MemoryRouter>

  );

};


// ==========================================
// TESTS
// ==========================================

describe(
  "MyPost Component",
  () => {


    beforeEach(() => {

      vi.clearAllMocks();

    });


    // ========================================
    // LOADING
    // ========================================

    test(
      "shows Loading while posts are being fetched",
      () => {

        axios.get.mockImplementation(
          () =>
            new Promise(() => {})
        );

        renderMyPost();

        expect(
          screen.getByText(
            "Loading..."
          )
        ).toBeInTheDocument();

      }
    );


    // ========================================
    // API REQUEST
    // ========================================

    test(
      "fetches logged-in user's posts",
      async () => {

        axios.get.mockResolvedValue({

          data: mockPosts,

        });


        renderMyPost();


        await waitFor(() => {

          expect(
            axios.get
          ).toHaveBeenCalledWith(

            "http://localhost:8083/api/posts/user",

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
      "displays user posts after fetching",
      async () => {

        axios.get.mockResolvedValue({

          data: mockPosts,

        });


        renderMyPost();


        await waitFor(() => {

          expect(
            screen.getByText(
              "My First Post"
            )
          ).toBeInTheDocument();


          expect(
            screen.getByText(
              "My Second Post"
            )
          ).toBeInTheDocument();

        });

      }
    );


    // ========================================
    // USERPOST COMPONENT
    // ========================================

    test(
      "renders UserPost for each post",
      async () => {

        axios.get.mockResolvedValue({

          data: mockPosts,

        });


        renderMyPost();


        await waitFor(() => {

          const userPosts =
            screen.getAllByTestId(
              "user-post"
            );


          expect(
            userPosts.length
          ).toBe(2);

        });

      }
    );


    // ========================================
    // AUTHORS
    // ========================================

    test(
      "displays post authors",
      async () => {

        axios.get.mockResolvedValue({

          data: mockPosts,

        });


        renderMyPost();


        await waitFor(() => {

          const authors =
            screen.getAllByText(
              "shakthi"
            );


          expect(
            authors.length
          ).toBe(2);

        });

      }
    );


    // ========================================
    // CONTENT
    // ========================================

    test(
      "displays post content",
      async () => {

        axios.get.mockResolvedValue({

          data: mockPosts,

        });


        renderMyPost();


        await waitFor(() => {

          expect(
            screen.getByText(
              "This is my first blog post with enough content."
            )
          ).toBeInTheDocument();


          expect(
            screen.getByText(
              "This is my second blog post with enough content."
            )
          ).toBeInTheDocument();

        });

      }
    );


    // ========================================
    // EMPTY POSTS
    // ========================================

    test(
      "shows No posts found when user has no posts",
      async () => {

        axios.get.mockResolvedValue({

          data: [],

        });


        renderMyPost();


        await waitFor(() => {

          expect(
            screen.getByText(
              "No posts found."
            )
          ).toBeInTheDocument();

        });

      }
    );


    // ========================================
    // NO USERPOST WHEN EMPTY
    // ========================================

    test(
      "does not render UserPost when there are no posts",
      async () => {

        axios.get.mockResolvedValue({

          data: [],

        });


        renderMyPost();


        await waitFor(() => {

          expect(
            screen.queryByTestId(
              "user-post"
            )
          ).not.toBeInTheDocument();

        });

      }
    );


    // ========================================
    // API ERROR
    // ========================================

    test(
      "handles API error without crashing",
      async () => {

        axios.get.mockRejectedValue({

          response: {

            status: 500,

            data: {

              message:
                "Internal Server Error",

            },

          },

        });


        renderMyPost();


        await waitFor(() => {

          expect(
            screen.getByText(
              "No posts found."
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
          new Error(
            "Network Error"
          )
        );


        renderMyPost();


        await waitFor(() => {

          expect(
            screen.getByText(
              "No posts found."
            )
          ).toBeInTheDocument();

        });

      }
    );


    // ========================================
    // LOADING DISAPPEARS
    // ========================================

    test(
      "removes Loading after successful request",
      async () => {

        axios.get.mockResolvedValue({

          data: mockPosts,

        });


        renderMyPost();


        await waitFor(() => {

          expect(
            screen.queryByText(
              "Loading..."
            )
          ).not.toBeInTheDocument();

        });

      }
    );


    // ========================================
    // LOADING AFTER ERROR
    // ========================================

    test(
      "removes Loading after API error",
      async () => {

        axios.get.mockRejectedValue(
          new Error(
            "Network Error"
          )
        );


        renderMyPost();


        await waitFor(() => {

          expect(
            screen.queryByText(
              "Loading..."
            )
          ).not.toBeInTheDocument();

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

          data: [],

        });


        renderMyPost({

          serverUrl:
            "http://localhost:9000",

        });


        await waitFor(() => {

          expect(
            axios.get
          ).toHaveBeenCalledWith(

            "http://localhost:9000/api/posts/user",

            {
              withCredentials: true,
            }

          );

        });

      }
    );


    // ========================================
    // MULTIPLE POSTS
    // ========================================

    test(
      "renders all returned posts",
      async () => {

        const manyPosts = [

          {
            id: 1,
            title: "Post One",
            content: "Content One",
            author: "shakthi",
          },

          {
            id: 2,
            title: "Post Two",
            content: "Content Two",
            author: "shakthi",
          },

          {
            id: 3,
            title: "Post Three",
            content: "Content Three",
            author: "shakthi",
          },

          {
            id: 4,
            title: "Post Four",
            content: "Content Four",
            author: "shakthi",
          },

        ];


        axios.get.mockResolvedValue({

          data: manyPosts,

        });


        renderMyPost();


        await waitFor(() => {

          const userPosts =
            screen.getAllByTestId(
              "user-post"
            );


          expect(
            userPosts.length
          ).toBe(4);

        });

      }
    );


    // ========================================
    // NO SERVER URL
    // ========================================

    test(
      "does not fetch posts when serverUrl is unavailable",
      async () => {

        renderMyPost({

          serverUrl: "",

        });


        await waitFor(() => {

          expect(
            screen.getByText(
              "No posts found."
            )
          ).toBeInTheDocument();

        });


        expect(
          axios.get
        ).not.toHaveBeenCalled();

      }
    );


    // ========================================
    // INVALID API RESPONSE
    // ========================================

    test(
      "handles non-array API response",
      async () => {

        axios.get.mockResolvedValue({

          data: {
            posts: mockPosts,
          },

        });


        renderMyPost();


        await waitFor(() => {

          expect(
            screen.getByText(
              "No posts found."
            )
          ).toBeInTheDocument();

        });

      }
    );


    // ========================================
    // REQUEST COUNT
    // ========================================

    test(
      "makes only one request on initial render",
      async () => {

        axios.get.mockResolvedValue({

          data: [],

        });


        renderMyPost();


        await waitFor(() => {

          expect(
            axios.get
          ).toHaveBeenCalledTimes(1);

        });

      }
    );


  }
);