import { useState } from "react";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    radius: "",
    texture: "",
    perimeter: "",
    area: "",
    smoothness: "",
    concavity: ""
  });

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [csvResults, setCsvResults] = useState([]);

  // -----------------------
  // Handle Input
  // -----------------------
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // -----------------------
  // Predict (Single)
  // -----------------------
  const handlePredict = async () => {
  try {
    // ❗ Check empty fields FIRST
    const values = Object.values(formData);

    if (values.some((val) => val === "")) {
      setResult("⚠ Please fill all fields");
      return;
    }

    // Convert to numbers
    const data = values.map((val) => Number(val));

    // ❗ Check invalid numbers
    if (data.some((val) => isNaN(val))) {
      setResult("⚠ Invalid input values");
      return;
    }

    console.log("Sending:", data);

    const response = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (result.prediction) {
      setResult(result.prediction);
    } else {
      setResult("Error: " + result.error);
    }

  } catch (error) {
    console.error(error);
    setResult("Server connection error");
  }
};

  // -----------------------
  // CSV Upload
  // -----------------------
  const handleCSV = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const text = await file.text();
    const rows = text.split("\n").slice(1);

    const data = rows.map(row =>
      row.split(",").map(Number)
    );

    try {
      setLoading(true);

      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      setCsvResults(result.predictions);

    } catch {
      alert("CSV error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-green-100 p-6">

      {/* 🔷 Patient Info Card */}
      <div className="bg-white shadow-xl rounded-2xl p-6 max-w-md mx-auto text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Patient Dashboard</h2>
        <p className="text-gray-600">ID: {user?.id}</p>
        <p className="text-gray-600">Name: {user?.name}</p>
        <p className="text-gray-600">Mobile: {user?.mobile}</p>
      </div>

      {/* 🔷 Prediction Form */}
      <div className="bg-white shadow-xl rounded-2xl p-6 max-w-md mx-auto">

        <h3 className="text-lg font-semibold mb-4">
          Enter Tumor Details
        </h3>

        {[
          { label: "Tumor Radius", name: "radius" },
          { label: "Texture", name: "texture" },
          { label: "Perimeter", name: "perimeter" },
          { label: "Area", name: "area" },
          { label: "Smoothness", name: "smoothness" },
          { label: "Concavity", name: "concavity" }
        ].map((field) => (
          <div key={field.name} className="mb-3">
            <label className="text-sm font-medium">
              {field.label}
            </label>
            <input
              type="number"
              step="any"
              name={field.name}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="Enter value..."
            />
          </div>
        ))}

        {/* Button */}
       <button
  onClick={handlePredict}
  disabled={Object.values(formData).some(val => val === "")}
  className="w-full bg-blue-600 text-white py-2 rounded-lg mt-3 disabled:bg-gray-400"
>
  Predict
</button>

        {/* 🔷 Result */}
        {result && (
          <div className={`mt-4 p-4 rounded-xl text-center font-semibold transition-all
            ${result.includes("Malignant") ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
            {result}
          </div>
        )}
      </div>

   
     

    </div>
  );
}