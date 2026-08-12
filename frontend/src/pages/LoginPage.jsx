import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/DataContext.jsx";
import axios from "axios";
import toast from "react-hot-toast";

export default function LoginPage() {

  const {
    serverUrl,
    setUserData
  } = useContext(userDataContext);

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {

    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      toast.error("Please enter username and password");
      return;
    }

    setLoading(true);

    try {

      const res = await axios.post(
        `${serverUrl}/api/auth/login`,
        {
          username,
          password
        },
        {
          withCredentials: true
        }
      );

      console.log("Login response:", res.data);

      // The JWT is stored in an HttpOnly cookie.
      // We only update the frontend authentication state here.
      setUserData({
        username
      });

      toast.success(
        res.data.message || "Login successful"
      );

      navigate("/");

    } catch (error) {

      console.log(
        "Login error:",
        error.response?.data || error.message
      );

      const msg =
        error.response?.data?.message ||
        "Invalid username or password";

      toast.error(msg);

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="flex justify-center px-4">

      <form
        className="w-full max-w-sm bg-white shadow-xl rounded-2xl p-6 space-y-4"
        onSubmit={handleLogin}
      >

        <h1 className="text-2xl font-bold text-center text-slate-800">
          Login
        </h1>

        {/* Username */}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-lg
                     outline-none focus:ring-2
                     ring-emerald-400"
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-lg
                     outline-none focus:ring-2
                     ring-emerald-400"
        />

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-emerald-500
                     text-white rounded-lg
                     hover:bg-emerald-600
                     transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

      </form>

    </div>
  );
}

