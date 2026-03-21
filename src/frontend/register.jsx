import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [data, setData] = useState({});
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://127.0.0.1:5000/register", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(data)
    });

    const result = await res.json();
    setMsg(result.message);

    if (result.message === "Registered Successfully") {
      setTimeout(() => navigate("/"), 1000);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-blue-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow w-80">
        <h2 className="text-xl font-bold mb-4">Register</h2>

        <input name="name" placeholder="Name" onChange={handleChange} className="input"/>
        <input name="email" placeholder="Email" onChange={handleChange} className="input"/>
        <input name="mobile" placeholder="Mobile" onChange={handleChange} className="input"/>
        <input name="password" type="password" placeholder="Password" onChange={handleChange} className="input"/>

        <button className="btn">Register</button>

        <p className="text-red-500 mt-2">{msg}</p>
      </form>
    </div>
  );
}