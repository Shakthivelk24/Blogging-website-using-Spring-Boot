import { useState } from "react";

export default function Post({ Post }) {
  const [open, setOpen] = useState(false);

  const shortText =
    Post.content.length > 150
      ? Post.content.substring(0, 150) + "..."
      : Post.content;

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

      {Post.content.length > 150 && (
        <button
          onClick={() => setOpen(!open)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
        >
          {open ? "Show Less" : "Read More"}
        </button>
      )}
    </div>
  );
}