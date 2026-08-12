import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/DataContext.jsx";
import axios from "axios";
import toast from "react-hot-toast";

export default function RegisterPage() {

  const { serverUrl } = useContext(userDataContext);

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {

    e.preventDefault();

    if (!username.trim() || !email.trim() || !password.trim()) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);

    try {

      const res = await axios.post(
        `${serverUrl}/api/auth/register`,
        {
          username,
          email,
          password
        }
      );

      toast.success(
        res.data.message || "Registration successful"
      );

      navigate("/login");

    } catch (error) {

      console.log(
        "Signup failed:",
        error.response?.data || error.message
      );

      const msg =
        error.response?.data?.message ||
        "Registration failed";

      toast.error(msg);

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="flex justify-center px-4">

      <form
        className="w-full max-w-sm bg-white shadow-xl rounded-2xl p-6 space-y-4"
        onSubmit={handleSignUp}
      >

        <h1 className="text-2xl font-bold text-center text-slate-800">
          Register
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

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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

        {/* Register */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-emerald-500
                     text-white rounded-lg
                     hover:bg-emerald-600
                     transition disabled:opacity-50"
        >
          {loading ? "Registering..." : "Register"}
        </button>

      </form>

    </div>
  );
}

