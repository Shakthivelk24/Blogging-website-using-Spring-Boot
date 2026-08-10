import { Link, useNavigate, useLocation } from "react-router-dom";
import { userDataContext } from "../context/UserContext.jsx";
import { useContext, useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function Header() {

  const {
    userData,
    setUserData,
    serverUrl
  } = useContext(userDataContext);

  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  const timer = useRef(null);

  // =========================
  // SEARCH
  // =========================

  const handleChange = (e) => {

    const val = e.target.value;

    setText(val);

    clearTimeout(timer.current);

    timer.current = setTimeout(() => {

      if (!val.trim()) {

        navigate("/");

      } else {

        navigate(
          "/?search=" +
          encodeURIComponent(val.trim())
        );
      }

    }, 500);
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogOut = async () => {

    try {

      const result = await axios.post(
        serverUrl + "/api/auth/logout",
        {},
        {
          withCredentials: true
        }
      );

      setUserData(null);
      setOpen(false);

      navigate("/");

      toast.success(result.data.message);

    } catch (error) {

      console.log(
        "Error in logging out:",
        error.response?.data || error.message
      );

      toast.error("Error in logging out");
    }
  };

  return (
    <header className="w-full border-b bg-white px-4 py-4">

      <div className="flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-bold"
        >
          SparkNote
          <span className="text-sm font-normal ml-2">
            - Share Your Stories
          </span>
        </Link>

        {/* Desktop Search */}
        {location.pathname === "/" && (
          <div className="hidden sm:block">

            <input
              type="text"
              value={text}
              onChange={handleChange}
              placeholder="Search post"
              className="border px-3 py-2 rounded w-64"
            />

          </div>
        )}

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-4 items-center">

          {userData ? (
            <>

              <Link
                to="/create-post"
                className="border p-2 bg-green-500 text-white rounded"
              >
                Create Post
              </Link>

              <Link
                to="/mypost"
                className="border p-2 bg-yellow-500 text-white rounded"
              >
                My Posts
              </Link>

              <button
                onClick={handleLogOut}
                className="border p-2 bg-red-500 text-white rounded"
              >
                Logout
              </button>

            </>
          ) : (
            <>

              <Link
                to="/login"
                className="border p-2 bg-blue-500 text-white rounded"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="border p-2 bg-orange-500 text-white rounded"
              >
                Create Account
              </Link>

            </>
          )}

        </nav>

      </div>

      {/* Mobile Search */}
      {location.pathname === "/" && (
        <form
          className="sm:hidden mt-3"
          onSubmit={(e) => e.preventDefault()}
        >

          <input
            type="text"
            value={text}
            onChange={handleChange}
            placeholder="Search post"
            className="border px-3 py-2 rounded w-full"
          />

        </form>
      )}

      {/* Mobile Navigation */}
      {open && (
        <nav className="md:hidden mt-4 grid gap-3">

          {userData ? (
            <>

              <Link
                to="/create-post"
                onClick={() => setOpen(false)}
                className="border p-2 bg-green-500 text-white rounded"
              >
                Create Post
              </Link>

              <Link
                to="/mypost"
                onClick={() => setOpen(false)}
                className="border p-2 bg-yellow-500 text-white rounded"
              >
                My Posts
              </Link>

              <button
                onClick={handleLogOut}
                className="border p-2 bg-red-500 text-white rounded"
              >
                Logout
              </button>

            </>
          ) : (
            <>

              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="border p-2 bg-blue-500 text-white rounded"
              >
                Login
              </Link>

              <Link
                to="/register"
                onClick={() => setOpen(false)}
                className="border p-2 bg-orange-500 text-white rounded"
              >
                Create Account
              </Link>

            </>
          )}

        </nav>
      )}

    </header>
  );
}

