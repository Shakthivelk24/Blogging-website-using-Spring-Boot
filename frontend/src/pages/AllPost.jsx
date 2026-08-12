import {
  useContext,
  useEffect,
  useState
} from "react";

import {
  userDataContext
} from "../context/DataContext.jsx";


import {
  useLocation,
  useNavigate
} from "react-router-dom";

import axios from "axios";


export default function AllPost() {

  const { serverUrl } =
    useContext(userDataContext);
  
  const navigate = useNavigate();

  const location = useLocation();

  const [posts, setPosts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);


  // =========================
  // FETCH POSTS
  // =========================

  useEffect(() => {

    const fetchPosts = async () => {

      try {

        setLoading(true);

        const params =
          new URLSearchParams(
            location.search
          );

        const search =
          params.get("search");


        let url;


        if (search && search.trim()) {

          url =
            `${serverUrl}/api/posts/search?keyword=` +
            encodeURIComponent(
              search.trim()
            );

        } else {

          url =
            `${serverUrl}/api/posts`;
        }


        console.log(
          "Fetching:",
          url
        );


        const response =
          await axios.get(
            url,
            {
              withCredentials: true
            }
          );


        setPosts(
          Array.isArray(response.data)
            ? response.data
            : []
        );

      } catch (error) {

        console.log(
          "Error fetching posts:",
          error.response?.data ||
          error.message
        );

        setPosts([]);

      } finally {

        setLoading(false);
      }
    };


    if (serverUrl) {
      fetchPosts();
    }

  }, [
    serverUrl,
    location.search
  ]);


  // =========================
  // SEARCH VALUE
  // =========================

  const params =
    new URLSearchParams(
      location.search
    );

  const search =
    params.get("search");


  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Heading skeleton */}

        <div className="mb-8">

          <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse mb-3" />

          <div className="h-4 w-72 bg-gray-200 rounded animate-pulse" />

        </div>


        {/* Cards */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {[1, 2, 3, 4, 5, 6].map(
            (item) => (

              <div
                key={item}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
              >

                <div className="flex items-center gap-3 mb-5">

                  <div className="w-11 h-11 rounded-full bg-gray-200 animate-pulse" />

                  <div>

                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2" />

                    <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />

                  </div>

                </div>


                <div className="h-6 w-4/5 bg-gray-200 rounded animate-pulse mb-4" />

                <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2" />

                <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse mb-6" />

                <div className="h-10 w-28 bg-gray-200 rounded-full animate-pulse" />

              </div>

            )
          )}

        </div>

      </main>
    );
  }


  // =========================
  // EMPTY STATE
  // =========================

  if (posts.length === 0) {

    return (

      <main className="min-h-[70vh] flex items-center justify-center px-4">

        <div className="text-center max-w-md">

          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-50 flex items-center justify-center">

            <span className="text-4xl">
              📝
            </span>

          </div>


          <h2 className="text-2xl font-bold text-gray-800 mb-2">

            {search
              ? "No posts found"
              : "No posts yet"}

          </h2>


          <p className="text-gray-500">

            {search
              ? `We couldn't find any posts matching "${search}".`
              : "Be the first person to share your story on SparkNote."}

          </p>

        </div>

      </main>
    );
  }


  // =========================
  // POSTS UI
  // =========================

  return (

    <main className="bg-gray-50 min-h-screen">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">


        {/* =========================
            PAGE HEADER
        ========================= */}

        <div className="mb-8">

          {search ? (

            <>
              <div className="flex items-center gap-2 mb-2">

                <span className="text-emerald-500 text-xl">
                  🔍
                </span>

                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">

                  Search Results

                </h1>

              </div>


              <p className="text-gray-500">

                Showing posts matching{" "}

                <span className="font-semibold text-gray-800">
                  "{search}"
                </span>

              </p>

            </>

          ) : (

            <>

              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">

                Latest Stories

              </h1>

              <p className="text-gray-500">

                Discover stories and ideas shared by the SparkNote community.

              </p>

            </>

          )}

        </div>


        {/* =========================
            POST GRID
        ========================= */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">


          {posts.map((post) => {

            const author =
              post.author ||
              "Anonymous";


            const firstLetter =
              author
                .charAt(0)
                .toUpperCase();


            const content =
              post.content || "";


            const preview =
              content.length > 150
                ? content.substring(0, 150) + "..."
                : content;


            return (

              <article
                key={post.id}
                className="
                  group
                  bg-white
                  border border-gray-200
                  rounded-2xl
                  overflow-hidden
                  shadow-sm
                  hover:shadow-xl
                  hover:-translate-y-1
                  transition-all
                  duration-300
                "
              >


                {/* =========================
                    CARD TOP
                ========================= */}

                <div className="p-6">


                  {/* Author */}

                  <div className="flex items-center justify-between mb-5">

                    <div className="flex items-center gap-3">

                      <div className="
                        w-11 h-11
                        rounded-full
                        bg-emerald-500
                        text-white
                        flex items-center
                        justify-center
                        font-bold
                        text-lg
                      ">

                        {firstLetter}

                      </div>


                      <div>

                        <p className="font-semibold text-gray-800">

                          {author}

                        </p>


                        <p className="text-xs text-gray-400">

                          SparkNote Author

                        </p>

                      </div>

                    </div>


                    <span className="
                      text-xs
                      px-3
                      py-1
                      rounded-full
                      bg-gray-100
                      text-gray-500
                    ">

                      Blog

                    </span>

                  </div>


                  {/* Title */}

                  <h2 className="
                    text-xl
                    font-bold
                    text-gray-900
                    mb-3
                    leading-snug
                    group-hover:text-emerald-600
                    transition-colors
                    duration-300
                  ">

                    {post.title}

                  </h2>


                  {/* Content */}

                  <p className="
                    text-gray-500
                    leading-relaxed
                    text-sm
                    min-h-[72px]
                  ">

                    {preview}

                  </p>


                  {/* Bottom */}

                  <div className="
                    mt-6
                    pt-5
                    border-t
                    border-gray-100
                    flex
                    items-center
                    justify-between
                  ">


                    <span className="
                      text-xs
                      text-gray-400
                    ">

                      #{post.id}

                    </span>


                    <button
                      onClick={() => navigate(`/post/${post.id}`)}
                      className="
                        px-4
                        py-2
                        rounded-full
                        bg-emerald-500
                        text-white
                        text-sm
                        font-semibold
                        hover:bg-emerald-600
                        transition
                        duration-300
                        group-hover:px-5
                      "
                    >

                      Read More →

                    </button>

                  </div>

                </div>

              </article>

            );

          })}

        </div>


        {/* =========================
            FOOTER TEXT
        ========================= */}

        <div className="text-center mt-12">

          <p className="text-sm text-gray-400">

            ✨ More stories coming soon

          </p>

        </div>

      </div>

    </main>
  );
}

