import { useState } from "react";

export default function App() {
  const [formData, setFormData] = useState({
    radius: "",
    texture: "",
    perimeter: "",
    area: "",
    smoothness: "",
    compactness: ""
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Prevent negative values
    if (value < 0) return;

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Dummy prediction (for UI only)
    const risk = Math.random() > 0.5;

    setResult(risk ? "Malignant (High Risk)" : "Benign (Low Risk)");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-200 flex items-center justify-center p-4">

      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md transition-all duration-500">

        <h1 className="text-2xl font-bold text-center mb-6">
          Breast Cancer Prediction
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Input Fields */}
          {[
            {
              label: "Tumor Radius",
              name: "radius",
              hint: "Size of tumor (e.g. 10.5)"
            },
            {
              label: "Texture",
              name: "texture",
              hint: "Smooth or rough surface"
            },
            {
              label: "Perimeter",
              name: "perimeter",
              hint: "Boundary length of tumor"
            },
            {
              label: "Area",
              name: "area",
              hint: "Size of tumor area"
            },
            {
              label: "Smoothness",
              name: "smoothness",
              hint: "How smooth the tumor edges are"
            },
            {
              label: "Compactness",
              name: "compactness",
              hint: "Density of tumor shape"
            }
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium">
                {field.label}
                <span className="text-gray-400 text-xs ml-1">
                  ({field.hint})
                </span>
              </label>

              <input
                type="number"
                step="any"
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                required
                className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition"
                placeholder="Enter value..."
              />
            </div>
          ))}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg mt-4 hover:bg-blue-700 transition"
          >
            Predict
          </button>
        </form>

        {/* Result Card */}
        {result && (
          <div
            className={`mt-6 p-4 rounded-xl text-center font-semibold text-lg transition-all duration-500 ${
              result.includes("Malignant")
                ? "bg-red-100 text-red-600"
                : "bg-green-100 text-green-600"
            }`}
          >
            {result}
          </div>
        )}
      </div>
    </div>
  );
}