import { useState } from "react";

export default function Post({ Post }) {

  const [open, setOpen] = useState(false);

  const content = Post.content || "";

  const shortText =
    content.length > 80
      ? content.slice(0, 80) + "..."
      : content;

  return (
    <article className="bg-white rounded-2xl shadow-md p-6">

      {/* Author */}
      <div className="flex items-center gap-3 mb-5">

        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
          {Post.author?.charAt(0).toUpperCase() || "U"}
        </div>

        <div>
          <p className="font-semibold text-gray-900">
            {Post.author || "Unknown User"}
          </p>
        </div>

      </div>

      {/* Title */}
      <h2 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
        {Post.title}
      </h2>

      {/* Content */}
      <p className="text-gray-600 leading-relaxed text-lg mb-6">
        {open ? content : shortText}
      </p>

      {/* Read More */}
      {content.length > 80 && (
        <button
          onClick={() => setOpen(!open)}
          className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors duration-300"
        >
          {open ? "Show Less" : "Read More"}
        </button>
      )}

    </article>
  );
}

