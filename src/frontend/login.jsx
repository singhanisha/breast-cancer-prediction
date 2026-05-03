import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import bgImage from "../assets/bgimage.jpg";

export default function Login() {
  const [data, setData] = useState({});
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(""); // old message clear

    try {
      const res = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.status === "success") {
        localStorage.setItem("user", JSON.stringify(result.user));

        if (
          result.user.role === "doctor" ||
          result.user.role === "nurse"
        ) {
          navigate("/dashboard");
        } 
        else if (result.user.role === "patient") {
          navigate("/patient-dashboard");
        }
      } 
      else {
        // wrong id/password message
        setMsg(result.message || "Invalid ID or Password");
        alert(result.message || "Invalid ID or Password");
      }
    } 
    catch (error) {
      setMsg("Server error. Please try again.");
      alert("Server error. Please try again.");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `
          linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)),
          url(${bgImage})
        `,
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-96 p-8 rounded-3xl 
                   bg-[#111827]/90 
                   border border-gray-700 
                   shadow-[0_0_40px_rgba(168,85,247,0.3)]"
      >
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Sign in
        </h2>

        {/* ID */}
        <input
          name="loginId"
          placeholder="Enter Email or Staff ID"
          onChange={handleChange}
          className="w-full mb-4 px-4 py-3 rounded-xl 
                     bg-[#020617] text-white 
                     border border-gray-700 
                     focus:outline-none focus:ring-2 focus:ring-purple-500" required
        />

        {/* Password */}
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full mb-4 px-4 py-3 rounded-xl 
                     bg-[#020617] text-white 
                     border border-gray-700 
                     focus:outline-none focus:ring-2 focus:ring-purple-500" required
        />

        <p className="text-center mt-3">
          <Link
            to="/forgot-password"
            className="text-purple-400 hover:underline text-sm"
          >
            Forgot Password?
          </Link>
        </p>

        {/* Button */}
        <button
          className="w-full py-3 rounded-xl 
                     bg-gradient-to-r from-purple-500 to-indigo-500 
                     hover:scale-105 transition 
                     text-white font-semibold shadow-lg"
        >
          Login
        </button>

        {/* Error Message */}
        <p className="text-red-400 mt-3 text-sm text-center">
          {msg}
        </p>

        {/* Register Link */}
        <p className="text-center text-gray-400 text-sm mt-4">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-purple-400 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}