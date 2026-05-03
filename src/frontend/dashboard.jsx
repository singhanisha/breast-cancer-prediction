import { useState } from "react";
import bgImage from "../assets/bgimage.jpg";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    patientName: "",
    age: "",
    email: "",
    mobile: "",
    address: "",
    date: "",
    radius: "",
    texture: "",
    perimeter: "",
    area: "",
    smoothness: "",
    concavity: "",
  });

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [pdfPath, setPdfPath] = useState("");

  // Input Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Prediction API
  const handlePredict = async () => {
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          patientName: formData.patientName,
          age: formData.age,
          email: formData.email,
          mobile: formData.mobile,
          address: formData.address,
          date: formData.date,

          doctorName: user?.name,
          doctorRole: user?.role,

          features: [
            Number(formData.radius),
            Number(formData.texture),
            Number(formData.perimeter),
            Number(formData.area),
            Number(formData.smoothness),
            Number(formData.concavity),
          ],
        }),
      });

      const data = await res.json();

      if (data.status === "success") {
        setResult(data.prediction);
        setPdfPath(data.pdf_path || "");
        alert("Prediction Completed Successfully");
      } else {
        setResult(data.error || "Prediction Failed");
      }
    } catch (error) {
      console.log(error);
      setResult("Server Error");
    }

    setLoading(false);
  };

  // Generate Report
  const handleGenerateReport = () => {
    if (!pdfPath) {
      alert("Please predict first");
      return;
    }

    const fileName = pdfPath.split("/").pop();

    window.open(
      `http://127.0.0.1:5000/download-report/${fileName}`,
      "_blank"
    );
  };

  // Navigation
  const handleViewHistory = () => {
    window.location.href = "/history";
  };

  const handleViewReports = () => {
    window.location.href = "/reports";
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat p-6"
      style={{
        backgroundImage: `
          linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)),
          url(${bgImage})
        `,
      }}
    >
      <div className="max-w-6xl mx-auto text-white">

        {/* 🔥 HEADER */}
        <div className="bg-[#0f172a]/90 rounded-3xl p-6 mb-6 border border-white/10 shadow-lg flex justify-between items-center">

          {/* LEFT */}
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Medical Dashboard
            </h1>

            <p className="text-lg text-gray-300">
              Logged in as:
              <span className="ml-2 font-semibold text-white">
                {user?.name || "Doctor"}
              </span>
            </p>

            <p className="text-gray-400">
              Role: {user?.role || "Medical Staff"}
            </p>
          </div>

          {/* RIGHT BUTTONS */}
          <div className="flex gap-3">

            <button
              onClick={handleViewReports}
              className="px-5 py-2 rounded-xl 
                         bg-gradient-to-r from-indigo-500 to-purple-500
                         text-white font-semibold 
                         hover:scale-105 transition shadow-lg"
            >
              View Reports
            </button>

            <button
              onClick={handleViewHistory}
              className="px-5 py-2 rounded-xl 
                         bg-[#1e293b] 
                         border border-purple-400
                         text-white font-semibold 
                         hover:bg-purple-500/20 
                         transition"
            >
              History
            </button>

          </div>
        </div>

        {/* 🧾 PATIENT DETAILS */}
        <div className="bg-[#111827]/90 rounded-3xl p-6 mb-6 border border-white/10 shadow-lg">
          <h2 className="text-2xl font-semibold mb-5">
            Patient Details
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input name="patientName" placeholder="Patient Name" onChange={handleChange} className="inputStyle" />
            <input name="age" placeholder="Age" onChange={handleChange} className="inputStyle" />
            <input name="email" placeholder="Patient Email" onChange={handleChange} className="inputStyle" />

            <input
              name="mobile"
              placeholder="Mobile"
              value={formData.mobile}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                if (value.length <= 10) {
                  setFormData({ ...formData, mobile: value });
                }
              }}
              className="inputStyle"
            />

            <input name="address" placeholder="Address" onChange={handleChange} className="inputStyle" />
            <input type="date" name="date" onChange={handleChange} className="inputStyle" />
          </div>
        </div>

        {/* 🔬 TUMOR DETAILS */}
        <div className="bg-[#111827]/90 rounded-3xl p-6 border border-white/10 shadow-lg">
          <h2 className="text-2xl font-semibold mb-5">
            Tumor Clinical Details
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {["radius","texture","perimeter","area","smoothness","concavity"].map((f) => (
              <input
                key={f}
                name={f}
                placeholder={f}
                type="number"
                step="any"
                onChange={handleChange}
                className="inputStyle"
              />
            ))}
          </div>

          {/* BUTTONS */}
          <div className="grid md:grid-cols-2 gap-4 mt-6">

            <button
              onClick={handlePredict}
              className="py-3 rounded-xl 
                         bg-gradient-to-r from-purple-500 to-indigo-500 
                         text-white font-semibold hover:scale-105 transition"
            >
              {loading ? "Predicting..." : "Predict"}
            </button>

            <button
              onClick={handleGenerateReport}
              className="py-3 rounded-xl 
                         bg-green-600 
                         text-white font-semibold hover:scale-105 transition"
            >
              Generate Report
            </button>

          </div>

          {/* RESULT */}
          {result && (
            <div className="mt-6 p-5 rounded-2xl border border-purple-400 bg-purple-500/10 text-center">
              <h2 className="text-xl font-bold">
                Prediction Result: {result}
              </h2>
            </div>
          )}
        </div>
      </div>

      {/* INPUT STYLE */}
      <style>{`
        .inputStyle {
          width: 100%;
          padding: 12px 16px;
          border-radius: 12px;
          background: #020617;
          color: white;
          border: 1px solid #374151;
          outline: none;
        }

        .inputStyle:focus {
          border-color: #a855f7;
          box-shadow: 0 0 0 2px rgba(168,85,247,0.3);
        }
      `}</style>
    </div>
  );
}