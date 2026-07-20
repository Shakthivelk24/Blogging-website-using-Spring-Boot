import { Link, useNavigate, useLocation } from "react-router-dom";
import { userDataContext } from "../context/UserContext.jsx";
import { useContext, useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function Header() {
  const { serverUrl } = useContext(userDataContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  const location = useLocation();

  return (
    <header className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center gap-3">
        {/* click on SparkNote to go to home page and its is the logo of the website */}
        <Link to="/" className="text-2xl font-bold text-slate-800 cursor-pointer">
          SparkNote  <span className="text-slate-500 text-sm">- Share Your Stories</span>
        </Link>

        <button className="md:hidden text-2xl" onClick={() => setOpen(!open)}>
          ☰
        </button>

        <nav className="hidden md:flex gap-4">
            <>
              <Link
                to="/create-post"
                className="border p-2 bg-green-500 text-white rounded"
              >
                Create Post
              </Link>
              </>
         </nav>
      </div>
      {open && (
        <nav className="md:hidden mt-4 grid gap-3">
            <>
              <Link
                to="/create-post"
                className="border p-2 bg-green-500 text-white rounded"
              >
                Create Post
              </Link>
            </>
        </nav>
      )}
    </header>
  );
}