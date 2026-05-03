import { Link } from "react-router-dom";
import bgImage from "../assets/bgimage.jpg";
import img1 from "../assets/smart prediction.png";
import img2 from "../assets/realtimeanalysis.jpg";
import img3 from "../assets/Medical Friendly.jpg";

export default function Home() {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat px-6 py-10"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      <div className="max-w-6xl mx-auto">

        {/* HERO SECTION */}
        <div className="grid md:grid-cols-2 gap-10 items-center min-h-[80vh]">

          {/* LEFT CONTENT */}
          <div className="text-white">

            <h1 className="text-5xl font-bold leading-tight mb-4">
              Breast Cancer <br /> Prediction System
            </h1>

            <p className="text-gray-300 mb-6 text-lg">
              Assist medical professionals in early detection of breast cancer
              using machine learning. Fast, reliable, and easy to use.

              <Link
                to="/know-more"
                className="ml-2 text-purple-400 hover:text-indigo-300 underline font-semibold transition"
              >
                Click here
              </Link>
            </p>

            <div className="flex flex-wrap gap-4 mb-6">

              <Link
                to="/login"
                className="px-6 py-3 rounded-xl
                           bg-gradient-to-r from-purple-500 to-indigo-500
                           hover:scale-105 transition font-semibold"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="px-6 py-3 rounded-xl
                           border border-white/30
                           hover:bg-gradient-to-r hover:from-purple-500 hover:to-indigo-500
                           hover:border-transparent hover:scale-105
                           transition font-semibold text-white"
              >
                Register
              </Link>

            </div>

            <div className="flex gap-6 text-sm text-gray-300">
              <span>• ML Powered</span>
              <span>• Accurate</span>
              <span>• Fast Results</span>
            </div>
          </div>

          {/* RIGHT SIDE CARDS */}
          <div className="grid gap-6">

            {/* CARD 1 */}
            <div className="bg-[#0f172a]/85 p-6 rounded-2xl
                            border border-white/10
                            shadow-[0_0_30px_rgba(168,85,247,0.3)]">

              <div className="flex items-center gap-3 mb-2">
                <img
                  src={img1}
                  alt="Smart Prediction"
                  className="w-8 h-8"
                />
                <h3 className="text-xl text-white font-semibold">
                  Smart Prediction
                </h3>
              </div>

              <p className="text-gray-400 text-sm">
                Uses trained ML model to classify tumor as
                benign or malignant.
              </p>
            </div>

            {/* CARD 2 */}
            <div className="bg-[#0f172a]/85 p-6 rounded-2xl
                            border border-white/10
                            shadow-[0_0_30px_rgba(99,102,241,0.3)]">

              <div className="flex items-center gap-3 mb-2">
                <img
                  src={img2}
                  alt="Real Time Analysis"
                  className="w-8 h-8"
                />
                <h3 className="text-xl text-white font-semibold">
                  Real-time Analysis
                </h3>
              </div>

              <p className="text-gray-400 text-sm">
                Get prediction instantly by entering
                tumor parameters.
              </p>
            </div>

            {/* CARD 3 */}
            <div className="bg-[#0f172a]/85 p-6 rounded-2xl
                            border border-white/10
                            shadow-[0_0_30px_rgba(16,185,129,0.3)]">

              <div className="flex items-center gap-3 mb-2">
                <img
                  src={img3}
                  alt="Medical Friendly"
                  className="w-8 h-8"
                />
                <h3 className="text-xl text-white font-semibold">
                  Medical Friendly
                </h3>
              </div>

              <p className="text-gray-400 text-sm">
                Designed for doctors and nurses with
                simple and user-friendly UI.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}