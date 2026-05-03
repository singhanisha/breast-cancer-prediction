import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import bgImage from "../assets/bgimage.jpg";

export default function Register() {
  const [data, setData] = useState({});
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Confirm Password validation
    if (data.password !== data.confirmPassword) {
      setMsg("Password and Confirm Password do not match");
      return;
    }

    const res = await fetch("http://127.0.0.1:5000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    setMsg(result.message);

    if (result.message === "Registered Successfully") {
      setTimeout(() => navigate("/login"), 1000);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat py-10"
      style={{
        backgroundImage: `
          linear-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0.25)),
          url(${bgImage})
        `,
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-[500px] p-10 rounded-3xl 
             bg-[#0f172a]/90 
             border border-white/10 
             shadow-[0_0_60px_rgba(168,85,247,0.4)]"
      >
        <h2 className="text-3xl font-bold text-white text-center mb-4">
          Create Account
        </h2>

        {/* Role */}
        <select
          name="role"
          onChange={handleChange}
          className="inputStyle text-gray-400"
        >
          <option value="">Select Role</option>
          <option value="doctor">Doctor</option>
          <option value="nurse">Nurse</option>
          <option value="patient">Patient</option>
        </select>

        {/* ID → only for Doctor & Nurse */}
        {data.role && data.role !== "patient" && (
          <input
            name="staffId"
            placeholder={
              data.role === "doctor"
                ? "Enter Doctor ID"
                : "Enter Nurse ID"
            }
            onChange={handleChange}
            className="inputStyle" required
          />
        )}

        {/* Full Name */}
        <input
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          className="inputStyle" required
        />

        {/* Email */}
        <input
          name="email"
          type="email"
          placeholder="Email Address"
          onChange={handleChange}
          className="inputStyle" required
        />

        {/* Mobile */}
        <input
          name="mobile"
          type="tel"
          placeholder="Mobile Number"
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, ""); // only digits
            if (value.length <= 10) {
              setData({ ...data, mobile: value });
            }
          }}
          value={data.mobile || ""}
          maxLength={10}
          className="inputStyle" required
        />

        {/* Age */}
        <input
          name="age"
          type="number"
          placeholder="Age"
          onChange={handleChange}
          className="inputStyle" required
        />

        {/* Gender */}
        <select
          name="gender"
          onChange={handleChange}
          className="inputStyle text-gray-400"
        >
          <option value="">Select Gender</option>
          <option value="female">Female</option>
          <option value="male">Male</option>
          <option value="other">Other</option>
        </select>

        {/* Password */}
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="inputStyle" required
        />

        {/* Confirm Password */}
        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          onChange={handleChange}
          className="inputStyle" required
        />

        {/* Register Button */}
        <button
          className="w-full py-3 rounded-xl 
                     bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 
                     hover:scale-105 transition 
                     text-white font-semibold"
        >
          Register
        </button>

        {/* Message */}
        <p className="text-red-400 mt-3 text-sm text-center">
          {msg}
        </p>

        {/* Login Link */}
        <p className="text-center text-gray-400 text-sm mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-400 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}