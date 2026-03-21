import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [data, setData] = useState({});
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({...data, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://127.0.0.1:5000/login", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (result.status === "success") {
      localStorage.setItem("user", JSON.stringify(result.user));
      navigate("/dashboard");
    } else {
      setMsg(result.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-purple-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow w-80">
        <h2 className="text-xl font-bold mb-4">Login</h2>

        <input name="email" placeholder="Email" onChange={handleChange} className="input"/>
        <input name="password" type="password" placeholder="Password" onChange={handleChange} className="input"/>

        <button className="btn">Login</button>

        <p className="text-red-500 mt-2">{msg}</p>

        <Link to="/register" className="text-blue-500 text-sm">Create account</Link>
      </form>
    </div>
  );
}