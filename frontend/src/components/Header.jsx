import {
  Link,
  useNavigate,
  useLocation
} from "react-router-dom";

import {
  userDataContext
} from "../context/DataContext.jsx";

import {
  useContext,
  useState,
  useRef
} from "react";

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
      setText("");

      navigate("/");

      toast.success(
        result.data.message ||
        "Logged out successfully"
      );

    } catch (error) {

      console.log(
        "Error in logging out:",
        error.response?.data ||
        error.message
      );

      toast.error(
        "Error in logging out"
      );
    }
  };


  // =========================
  // CLOSE MOBILE MENU
  // =========================

  const closeMenu = () => {
    setOpen(false);
  };


  // =========================
  // USER INITIAL
  // =========================

  const username =
    userData?.username ||
    userData?.userName ||
    "User";

  const userInitial =
    username
      .charAt(0)
      .toUpperCase();


  return (

    <header className="
      sticky
      top-0
      z-50
      w-full
      bg-white/95
      backdrop-blur-md
      border-b
      border-gray-200
      shadow-sm
    ">

      <div className="
        max-w-7xl
        mx-auto
        px-4
        sm:px-6
        lg:px-8
      ">


        {/* =========================
            DESKTOP / MAIN HEADER
        ========================= */}

        <div className="
          h-[72px]
          flex
          items-center
          justify-between
          gap-4
        ">


          {/* =========================
              LOGO
          ========================= */}

          <Link
            to="/"
            onClick={() => {
              setText("");
              closeMenu();
            }}
            className="
              flex
              items-center
              gap-2
              shrink-0
              group
            "
          >

            {/* Logo Icon */}

            <div className="
              w-10
              h-10
              rounded-xl
              bg-emerald-500
              text-white
              flex
              items-center
              justify-center
              shadow-md
              group-hover:bg-emerald-600
              group-hover:scale-105
              transition-all
              duration-300
            ">

              <span className="
                text-xl
                font-bold
              ">
                S
              </span>

            </div>


            {/* Logo Text */}

            <div className="hidden sm:block">

              <h1 className="
                text-xl
                font-bold
                text-gray-900
                leading-none
              ">

                Spark<span className="text-emerald-500">
                  Note
                </span>

              </h1>

              <p className="
                text-[10px]
                text-gray-400
                mt-1
              ">

                Share Your Stories

              </p>

            </div>

          </Link>


          {/* =========================
              DESKTOP SEARCH
          ========================= */}

          {location.pathname === "/" && (

            <div className="
              hidden
              md:flex
              flex-1
              max-w-md
              mx-auto
            ">

              <div className="
                relative
                w-full
              ">

                {/* Search Icon */}

                <span className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                  text-lg
                ">

                  🔍

                </span>


                <input
                  type="text"
                  value={text}
                  onChange={handleChange}
                  placeholder="Search stories..."
                  className="
                    w-full
                    h-11
                    pl-11
                    pr-4
                    bg-gray-50
                    border
                    border-gray-200
                    rounded-full
                    text-sm
                    text-gray-800
                    placeholder:text-gray-400
                    outline-none
                    focus:bg-white
                    focus:border-emerald-400
                    focus:ring-4
                    focus:ring-emerald-50
                    transition-all
                    duration-300
                  "
                />

              </div>

            </div>

          )}


          {/* =========================
              DESKTOP NAVIGATION
          ========================= */}

          <nav className="
            hidden
            md:flex
            items-center
            gap-2
          ">


            {userData ? (

              <>

                {/* User */}

                <div className="
                  flex
                  items-center
                  gap-2
                  mr-2
                  px-2
                ">

                  <div className="
                    w-9
                    h-9
                    rounded-full
                    bg-emerald-100
                    text-emerald-700
                    flex
                    items-center
                    justify-center
                    font-bold
                    text-sm
                  ">

                    {userInitial}

                  </div>

                  <span className="
                    hidden
                    lg:block
                    text-sm
                    font-semibold
                    text-gray-700
                  ">

                    {username}

                  </span>

                </div>


                {/* Create Post */}

                <Link
                  to="/create-post"
                  className="
                    flex
                    items-center
                    gap-2
                    px-4
                    py-2.5
                    bg-emerald-500
                    hover:bg-emerald-600
                    text-white
                    rounded-xl
                    text-sm
                    font-semibold
                    shadow-sm
                    hover:shadow-md
                    transition-all
                    duration-300
                  "
                >

                  <span className="text-lg">
                    +
                  </span>

                  Create

                </Link>


                {/* My Posts */}

                <Link
                  to="/mypost"
                  className="
                    flex
                    items-center
                    gap-2
                    px-4
                    py-2.5
                    bg-white
                    border
                    border-gray-200
                    hover:border-emerald-300
                    hover:bg-emerald-50
                    text-gray-700
                    rounded-xl
                    text-sm
                    font-semibold
                    transition-all
                    duration-300
                  "
                >

                  <span>
                    📚
                  </span>

                  My Posts

                </Link>


                {/* Logout */}

                <button
                  onClick={handleLogOut}
                  className="
                    px-4
                    py-2.5
                    text-sm
                    font-semibold
                    text-gray-500
                    hover:text-red-500
                    hover:bg-red-50
                    rounded-xl
                    transition-all
                    duration-300
                  "
                >

                  Logout

                </button>

              </>

            ) : (

              <>

                {/* Login */}

                <Link
                  to="/login"
                  className="
                    px-4
                    py-2.5
                    text-sm
                    font-semibold
                    text-gray-700
                    hover:text-emerald-600
                    transition
                  "
                >

                  Login

                </Link>


                {/* Create Account */}

                <Link
                  to="/register"
                  className="
                    px-5
                    py-2.5
                    bg-emerald-500
                    hover:bg-emerald-600
                    text-white
                    rounded-xl
                    text-sm
                    font-semibold
                    shadow-sm
                    hover:shadow-md
                    transition-all
                    duration-300
                  "
                >

                  Create Account

                </Link>

              </>

            )}

          </nav>


          {/* =========================
              MOBILE MENU BUTTON
          ========================= */}

          <button
            className="
              md:hidden
              w-10
              h-10
              rounded-xl
              bg-gray-100
              hover:bg-gray-200
              flex
              items-center
              justify-center
              text-xl
              transition
            "
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >

            {open ? "✕" : "☰"}

          </button>

        </div>


        {/* =========================
            MOBILE SEARCH
        ========================= */}

        {location.pathname === "/" && (

          <div className="
            md:hidden
            pb-4
          ">

            <div className="
              relative
              w-full
            ">

              <span className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-gray-400
              ">

                🔍

              </span>

              <input
                type="text"
                value={text}
                onChange={handleChange}
                placeholder="Search stories..."
                className="
                  w-full
                  h-11
                  pl-11
                  pr-4
                  bg-gray-50
                  border
                  border-gray-200
                  rounded-full
                  text-sm
                  outline-none
                  focus:bg-white
                  focus:border-emerald-400
                  focus:ring-4
                  focus:ring-emerald-50
                  transition
                "
              />

            </div>

          </div>

        )}


        {/* =========================
            MOBILE NAVIGATION
        ========================= */}

        {open && (

          <nav className="
            md:hidden
            pb-5
            pt-2
            border-t
            border-gray-100
            space-y-2
          ">


            {userData ? (

              <>

                {/* Mobile User */}

                <div className="
                  flex
                  items-center
                  gap-3
                  p-3
                  mb-3
                  bg-emerald-50
                  rounded-xl
                ">

                  <div className="
                    w-10
                    h-10
                    rounded-full
                    bg-emerald-500
                    text-white
                    flex
                    items-center
                    justify-center
                    font-bold
                  ">

                    {userInitial}

                  </div>

                  <div>

                    <p className="
                      text-xs
                      text-gray-400
                    ">
                      Logged in as
                    </p>

                    <p className="
                      font-semibold
                      text-gray-800
                    ">

                      {username}

                    </p>

                  </div>

                </div>


                {/* Create */}

                <Link
                  to="/create-post"
                  onClick={closeMenu}
                  className="
                    flex
                    items-center
                    gap-3
                    p-3
                    bg-emerald-500
                    text-white
                    rounded-xl
                    font-semibold
                    hover:bg-emerald-600
                    transition
                  "
                >

                  <span className="text-xl">
                    +
                  </span>

                  Create Post

                </Link>


                {/* My Posts */}

                <Link
                  to="/mypost"
                  onClick={closeMenu}
                  className="
                    flex
                    items-center
                    gap-3
                    p-3
                    bg-gray-50
                    border
                    border-gray-200
                    text-gray-700
                    rounded-xl
                    font-semibold
                    hover:bg-emerald-50
                    hover:border-emerald-200
                    transition
                  "
                >

                  <span>
                    📚
                  </span>

                  My Posts

                </Link>


                {/* Logout */}

                <button
                  onClick={handleLogOut}
                  className="
                    w-full
                    flex
                    items-center
                    gap-3
                    p-3
                    text-left
                    bg-red-50
                    text-red-500
                    rounded-xl
                    font-semibold
                    hover:bg-red-100
                    transition
                  "
                >

                  <span>
                    ↪
                  </span>

                  Logout

                </button>

              </>

            ) : (

              <>

                {/* Login */}

                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="
                    block
                    p-3
                    text-center
                    bg-gray-50
                    border
                    border-gray-200
                    text-gray-700
                    rounded-xl
                    font-semibold
                    hover:bg-emerald-50
                    hover:border-emerald-200
                    transition
                  "
                >

                  Login

                </Link>


                {/* Register */}

                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="
                    block
                    p-3
                    text-center
                    bg-emerald-500
                    text-white
                    rounded-xl
                    font-semibold
                    hover:bg-emerald-600
                    transition
                  "
                >

                  Create Account

                </Link>

              </>

            )}

          </nav>

        )}

      </div>

    </header>
  );
}