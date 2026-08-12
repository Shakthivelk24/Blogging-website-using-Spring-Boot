import { useContext, useEffect, useState } from "react";
import { userDataContext } from "../context/DataContext.jsx";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

function EditPost() {

  const { id } = useParams();

  const { serverUrl } = useContext(userDataContext);

  const navigate = useNavigate();

  const [editPost, setEditPost] = useState(null);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // =========================
  // GET POST
  // =========================

  useEffect(() => {

    const fetchPostById = async () => {

      try {

        const response = await axios.get(
          `${serverUrl}/api/posts/${id}`,
          {
            withCredentials: true
          }
        );

        setEditPost(response.data);

      } catch (error) {

        console.log(
          "Error fetching post:",
          error.response?.data || error.message
        );

        toast.error("Unable to load post");
      }
    };

    fetchPostById();

  }, [serverUrl, id]);


  // =========================
  // SET FORM DATA
  // =========================

  useEffect(() => {

    if (editPost) {

      setTitle(editPost.title || "");
      setContent(editPost.content || "");

    }

  }, [editPost]);


  // =========================
  // UPDATE POST
  // =========================

  const handleSave = async () => {

    if (!title.trim() || !content.trim()) {
      toast.error("Please fill all fields");
      return;
    }

    if (content.length < 100) {
      toast.error("Content must be at least 100 characters");
      return;
    }

    setLoading(true);

    try {

      await axios.put(
        `${serverUrl}/api/posts/${id}`,
        {
          title,
          content
        },
        {
          withCredentials: true
        }
      );

      toast.success("Post updated successfully");

      navigate("/mypost");

    } catch (error) {

      console.log(
        "Error updating post:",
        error.response?.data || error.message
      );

      if (error.response?.status === 401) {
        toast.error("Please login first");
      } else if (error.response?.status === 403) {
        toast.error("You cannot edit this post");
      } else {
        toast.error("Error updating post");
      }

    } finally {

      setLoading(false);

    }
  };


  return (
    <div className="flex flex-col items-center justify-center gap-4 mt-5">

      {/* Title */}
      <div>

        <h1 className="font-semibold text-lg mb-2">
          Title
        </h1>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-[300px] h-[60px]
                     lg:w-[555px] lg:h-[60px]
                     text-center font-semibold
                     border rounded-lg outline-none
                     focus:ring-2 ring-blue-400"
        />

      </div>


      {/* Content */}
      <div>

        <h1 className="font-semibold text-lg mb-2">
          Content
        </h1>

        <textarea
          value={content}
          minLength={100}
          maxLength={500}
          onChange={(e) => setContent(e.target.value)}
          className="w-[300px] h-[150px]
                     lg:w-[555px] lg:h-[180px]
                     p-3 font-semibold
                     border rounded-lg outline-none
                     focus:ring-2 ring-blue-400"
        />

        <p className="mt-1 text-sm text-gray-600">
          {content.length} / 500 characters
        </p>

      </div>


      {/* Buttons */}
      <div className="flex gap-3">

        <button
          className="min-w-[150px] h-[60px]
                     bg-green-500 font-semibold
                     text-white rounded-full
                     hover:bg-green-600
                     disabled:opacity-50"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>


        <button
          className="min-w-[150px] h-[60px]
                     bg-gray-400 font-semibold
                     text-white rounded-full
                     hover:bg-gray-500"
          onClick={() => navigate("/mypost")}
          disabled={loading}
        >
          Cancel
        </button>

      </div>

    </div>
  );
}

export default EditPost;

