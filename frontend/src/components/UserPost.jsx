import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import { userDataContext } from "../context/UserContext";
import toast from "react-hot-toast";

export default function UserPost({ post, setPost }) {

  const navigate = useNavigate();

  const { serverUrl } = useContext(userDataContext);

  const handleDelete = async (id) => {

    try {

      await axios.delete(
        `${serverUrl}/api/posts/${id}`,
        {
          withCredentials: true,
        }
      );

      toast.success("Post deleted");

      // Remove post from UI without reloading
      setPost((old) =>
        old.filter((p) => p.id !== id)
      );

    } catch (error) {

      toast.error("Delete error");

      console.log(
        "Delete error:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <article className="bg-white rounded-2xl shadow-md overflow-hidden">

      <div className="md:w-3/5 p-8">

        {/* Title */}
        <h2 className="text-2xl font-bold mb-4">
          {post.title}
        </h2>

        {/* Content */}
        <p className="mb-6 text-gray-600">
          {post.content}
        </p>

        {/* Buttons */}
        <div className="flex gap-2">

          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() =>
              navigate("/edit-post/" + post.id)
            }
          >
            Edit
          </button>

          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={() =>
              handleDelete(post.id)
            }
          >
            Delete
          </button>

        </div>

      </div>

    </article>
  );
}

