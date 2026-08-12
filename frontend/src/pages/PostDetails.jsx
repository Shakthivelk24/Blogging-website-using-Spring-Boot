import {
  useContext,
  useEffect,
  useState
} from "react";

import {
  useNavigate,
  useParams
} from "react-router-dom";

import axios from "axios";

import {
  userDataContext
} from "../context/DataContext.jsx";


export default function PostDetails() {

  const { id } = useParams();

  const navigate = useNavigate();

  const { serverUrl } =
    useContext(userDataContext);

  const [post, setPost] =
    useState(null);

  const [loading, setLoading] =
    useState(true);


  // =========================
  // FETCH POST
  // =========================

  useEffect(() => {

    const fetchPost = async () => {

      try {

        setLoading(true);

        const response =
          await axios.get(
            `${serverUrl}/api/posts/${id}`,
            {
              withCredentials: true
            }
          );

        setPost(response.data);

      } catch (error) {

        console.log(
          "Error fetching post:",
          error.response?.data ||
          error.message
        );

        setPost(null);

      } finally {

        setLoading(false);
      }
    };


    if (serverUrl && id) {
      fetchPost();
    }

  }, [serverUrl, id]);


  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (
      <div className="min-h-[70vh] flex items-center justify-center">

        <div className="text-center">

          <div className="
            w-10 h-10
            border-4
            border-gray-200
            border-t-emerald-500
            rounded-full
            animate-spin
            mx-auto
            mb-4
          " />

          <p className="text-gray-500">
            Loading post...
          </p>

        </div>

      </div>
    );
  }


  // =========================
  // POST NOT FOUND
  // =========================

  if (!post) {

    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">

        <div className="text-center">

          <div className="text-5xl mb-4">
            📝
          </div>

          <h2 className="
            text-2xl
            font-bold
            text-gray-800
            mb-2
          ">
            Post not found
          </h2>

          <p className="text-gray-500 mb-6">
            This post may have been deleted or
            does not exist.
          </p>

          <button
            onClick={() => navigate("/")}
            className="
              px-5 py-2
              bg-emerald-500
              text-white
              rounded-full
              font-semibold
              hover:bg-emerald-600
              transition
            "
          >
            ← Back to Posts
          </button>

        </div>

      </div>
    );
  }


  const author =
    post.author || "Anonymous";

  const firstLetter =
    author.charAt(0).toUpperCase();


  // =========================
  // POST DETAILS
  // =========================

  return (

    <main className="min-h-screen bg-gray-50 py-10 px-4">

      <div className="
        max-w-4xl
        mx-auto
      ">


        {/* BACK BUTTON */}

        <button
          onClick={() => navigate(-1)}
          className="
            mb-6
            text-sm
            font-semibold
            text-gray-500
            hover:text-emerald-600
            transition
          "
        >
          ← Back
        </button>


        {/* POST CARD */}

        <article className="
          bg-white
          rounded-3xl
          shadow-sm
          border
          border-gray-200
          overflow-hidden
        ">


          {/* TOP SECTION */}

          <div className="p-6 sm:p-10">


            {/* AUTHOR */}

            <div className="
              flex
              items-center
              gap-4
              mb-8
            ">

              <div className="
                w-14 h-14
                rounded-full
                bg-emerald-500
                text-white
                flex
                items-center
                justify-center
                text-xl
                font-bold
              ">

                {firstLetter}

              </div>


              <div>

                <p className="
                  font-semibold
                  text-gray-900
                ">

                  {author}

                </p>

                <p className="
                  text-sm
                  text-gray-400
                ">

                  SparkNote Author

                </p>

              </div>

            </div>


            {/* TITLE */}

            <h1 className="
              text-3xl
              sm:text-5xl
              font-bold
              text-gray-900
              leading-tight
              mb-8
            ">

              {post.title}

            </h1>


            {/* CONTENT */}

            <div className="
              text-gray-700
              text-lg
              leading-8
              whitespace-pre-wrap
            ">

              {post.content}

            </div>


            {/* FOOTER */}

            <div className="
              mt-10
              pt-6
              border-t
              border-gray-100
              flex
              items-center
              justify-between
            ">

              <span className="
                text-sm
                text-gray-400
              ">

                Post #{post.id}

              </span>


              <button
                onClick={() => navigate("/")}
                className="
                  px-5 py-2
                  bg-gray-100
                  text-gray-700
                  rounded-full
                  text-sm
                  font-semibold
                  hover:bg-gray-200
                  transition
                "
              >
                Back to Home
              </button>

            </div>

          </div>

        </article>

      </div>

    </main>
  );
}

