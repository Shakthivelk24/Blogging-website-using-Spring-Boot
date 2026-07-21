import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { userDataContext } from "../context/DataContext";

export default function Post({ Post, setPost }) {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const { serverUrl  } = useContext(userDataContext);

  const shortText =
    Post.content.length > 150
      ? Post.content.substring(0, 150) + "..."
      : Post.content;

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${serverUrl}/${id}`);

      toast.success("Post deleted successfully");

      // Remove deleted post from UI
      setPost((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      toast.error("Failed to delete post");
      console.error(error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 p-6">
      {/* Author */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
          {Post.author.charAt(0).toUpperCase()}
        </div>

        <div>
          <h3 className="font-semibold text-gray-800">{Post.author}</h3>
        </div>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold text-gray-900 mb-3">
        {Post.title}
      </h2>

      {/* Content */}
      <p className="text-gray-600 leading-7 mb-5">
        {open ? Post.content : shortText}
      </p>

      {/* Read More */}
      {Post.content.length > 150 && (
        <button
          onClick={() => setOpen(!open)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
        >
          {open ? "Show Less" : "Read More"}
        </button>
      )}

      {/* Edit & Delete Buttons */}
      <div className="flex gap-3 mt-5">
        <button
          onClick={() => navigate(`/edit-post/${Post.id}`)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg transition"
        >
          Edit
        </button>

        <button
          onClick={() => handleDelete(Post.id)}
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
}