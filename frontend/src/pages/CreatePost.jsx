import { useContext, useState } from "react";
import { userDataContext } from "../context/DataContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function CreatePost() {
  const { serverUrl, setPost } = useContext(userDataContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePost = async () => {
    if (!title || !content || !author) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(serverUrl, {
        title,
        content,
        author,
      });

      setPost(res.data);

      // 🔥 reset everything after success
      setTitle("");
      setContent("");
      setAuthor("");
      toast.success("Post created successfully");
      setLoading(false);

      navigate("/");
    } catch (err) {
      console.log("ERR :", err.message);
      toast.error("Error creating post");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 mt-5">
      {/* Title */}
      <div>
        <h1 className="font-semibold text-lg mb-2">Title</h1>
        <input
          type="text"
          placeholder="Enter title here"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-75 h-[60px] lg:w-[555px] lg:h-[60px] placeholder:text-center text-center font-semibold border rounded-lg outline-none focus:ring-2 ring-blue-400"
        />
      </div>

      {/* Content */}
      <div>
        <h1 className="font-semibold text-lg mb-2">Content</h1>
        <textarea
          placeholder="Enter content here"
          minLength={100}
          maxLength={500}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="w-[300px] h-[60px] lg:w-[555px] lg:h-[60px] p-3 font-semibold border rounded-lg outline-none focus:ring-2 ring-blue-400"
        />
        <p className="mt-1 text-sm text-gray-600">
          {content.length} / 500 characters (Min 100)
        </p>
      </div>

      {/* Author */}
      <div>
        <h1 className="font-semibold text-lg mb-2">Author</h1>
        <input
          type="text"
          placeholder="Enter author name here"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
          className="w-[300px] h-[60px] lg:w-[555px] lg:h-[60px] placeholder:text-center text-center font-semibold border rounded-lg outline-none focus:ring-2 ring-blue-400"
        />
      </div>

      {/* Submit Button */}
      {title && content && author && (
        <button
          className="min-w-[150px] h-[60px] mt-[10px] bg-green-500 text-xl font-semibold text-white rounded-full hover:bg-green-600 cursor-pointer"
          onClick={handlePost}
          disabled={loading}
        >
          {loading ? "Posting..." : "Create Post"}
        </button>
      )}
    </div>
  );
}

export default CreatePost;
