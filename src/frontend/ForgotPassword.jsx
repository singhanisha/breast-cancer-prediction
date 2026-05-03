import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import bgImage from "../assets/bgimage.jpg";

export default function ForgotPassword() {
  const [data, setData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  // Handle Input Change
  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password match validation
    if (data.newPassword !== data.confirmPassword) {
      setMsg("Password and Confirm Password do not match");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:5000/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          newPassword: data.newPassword,
        }),
      });

      const result = await res.json();
      setMsg(result.message);

      // Success → Redirect to Login Page
      if (result.message === "Password updated successfully") {
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }

    } catch (error) {
      setMsg("Something went wrong. Please try again.");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat px-6"
      style={{
        backgroundImage: `
          linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)),
          url(${bgImage})
        `,
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-[450px] p-8 rounded-3xl
                   bg-[#0f172a]/90
                   border border-white/10
                   shadow-[0_0_50px_rgba(168,85,247,0.35)]"
      >
        {/* Heading */}
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Reset Password
        </h2>

        <p className="text-gray-400 text-sm text-center mb-6">
          Enter your registered email and set a new password
        </p>

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Enter Email Address"
          value={data.email}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-3 rounded-xl
                     bg-[#020617] text-white
                     border border-gray-700
                     focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />

        {/* New Password */}
        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={data.newPassword}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-3 rounded-xl
                     bg-[#020617] text-white
                     border border-gray-700
                     focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />

        {/* Confirm Password */}
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={data.confirmPassword}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-3 rounded-xl
                     bg-[#020617] text-white
                     border border-gray-700
                     focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />

        {/* Button */}
        <button
          type="submit"
          className="w-full py-3 rounded-xl
                     bg-gradient-to-r from-purple-500 to-indigo-500
                     hover:scale-105 transition
                     text-white font-semibold shadow-lg"
        >
          Reset Password
        </button>

        {/* Message */}
        {msg && (
          <p className="text-center text-red-400 mt-4 text-sm">
            {msg}
          </p>
        )}

        {/* Back to Login */}
        <p className="text-center text-gray-400 text-sm mt-5">
          Back to{" "}
          <Link
            to="/login"
            className="text-purple-400 hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}