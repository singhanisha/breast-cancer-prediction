import { Link } from "react-router-dom";
import bgImage from "../assets/bgimage.jpg";
import pie from "../assets/PieChart.jpg";
import hist from "../assets/Histogram.jpg";
import pair from "../assets/Pairplot.jpg";
import heat from "../assets/HeatMap.jpg";

export default function KnowMore() {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat p-6"
      style={{
        backgroundImage: `
          linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)),
          url(${bgImage})
        `,
      }}
    >
      <div className="max-w-6xl mx-auto text-white">

        {/* Heading */}
        <div className="bg-[#0f172a]/90 rounded-3xl p-8 mb-6 border border-white/10 shadow-lg">
          <h1 className="text-4xl font-bold mb-4">
            Breast Cancer Prediction System
          </h1>

          <p className="text-gray-300 text-lg">
            This project uses Machine Learning to help doctors and nurses
            detect breast cancer early by analyzing tumor clinical features.
            Multiple ML models were compared and the best-performing model
            was selected for final deployment.
          </p>
        </div>

        {/* Model Comparison */}
        <div className="bg-[#111827]/90 rounded-3xl p-6 mb-6 border border-white/10">
          <h2 className="text-2xl font-semibold mb-5">
            Model Comparison
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-center border border-gray-700 rounded-xl overflow-hidden">

              <thead className="bg-purple-700">
                <tr>
                  <th className="p-4">Model</th>
                  <th className="p-4">Accuracy</th>
                  <th className="p-4">Precision</th>
                  <th className="p-4">Recall</th>
                  <th className="p-4">F1 Score</th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-b border-gray-700">
                  <td className="p-4">Logistic Regression</td>
                  <td>96.49%</td>
                  <td>97.56%</td>
                  <td>93.02%</td>
                  <td>95.24%</td>
                </tr>

                <tr className="border-b border-gray-700">
                  <td className="p-4">Decision Tree</td>
                  <td>92.98%</td>
                  <td>90.70%</td>
                  <td>90.70%</td>
                  <td>90.70%</td>
                </tr>

                <tr className="bg-green-500/10">
                  <td className="p-4 font-bold text-green-400">
                    Random Forest (Selected)
                  </td>
                  <td>97.37%</td>
                  <td>95.45%</td>
                  <td>97.67%</td>
                  <td>96.55%</td>
                </tr>
              </tbody>

            </table>
          </div>
        </div>

        {/* Why Random Forest */}
        <div className="bg-[#111827]/90 rounded-3xl p-6 mb-6 border border-white/10">
          <h2 className="text-2xl font-semibold mb-4">
            Why Random Forest Was Selected?
          </h2>

          <ul className="space-y-2 text-gray-300 list-disc ml-5">
            <li>Highest overall accuracy among all models</li>
            <li>Better recall for malignant case detection</li>
            <li>Better F1 Score and strong prediction stability</li>
            <li>Less overfitting compared to Decision Tree</li>
            <li>More reliable for medical diagnosis systems</li>
          </ul>
        </div>

        {/* EDA Section */}
        <div className="bg-[#111827]/90 rounded-3xl p-6 mb-6 border border-white/10">
          <h2 className="text-2xl font-semibold mb-6">
            Exploratory Data Analysis (EDA)
          </h2>

          <div className="space-y-8 text-gray-300">

            {/* Pie Chart */}
            <div className="flex gap-6 items-center">
              <img src={pie} className="w-32 h-32 rounded-xl" />
              <div>
                <h3 className="text-xl text-white font-semibold mb-2">
                  Pie Chart (Diagnosis Distribution)
                </h3>
                <p>
                  Dataset contains{" "}
                  <span className="text-green-400 font-semibold">62.7% Benign</span> and{" "}
                  <span className="text-red-400 font-semibold">37.3% Malignant</span>.
                  Benign cases are higher than malignant cases.
                </p>
              </div>
            </div>

            {/* Heatmap */}
            <div className="flex gap-6 items-center">
              <img src={heat} className="w-32 h-32 rounded-xl" />
              <div>
                <h3 className="text-xl text-white font-semibold mb-2">
                  Heatmap
                </h3>
                <p>
                  Shows feature correlation. Radius, Perimeter, and Area are highly correlated (~0.99).
                </p>

                <ul className="mt-2 ml-4 list-disc">
                  <li>Perimeter → 0.74</li>
                  <li>Radius → 0.73</li>
                  <li>Area → 0.71</li>
                </ul>

                <p className="mt-2">
                  Texture and Smoothness show weaker correlation.
                </p>
              </div>
            </div>

            {/* Pairplot */}
            <div className="flex gap-6 items-center">
              <img src={pair} className="w-32 h-32 rounded-xl" />
              <div>
                <h3 className="text-xl text-white font-semibold mb-2">
                  Pairplot
                </h3>
                <p>
                  Shows relationships between features. Malignant values are generally higher than benign.
                  Clear separation trend is visible.
                </p>
              </div>
            </div>

            {/* Histogram */}
            <div className="flex gap-6 items-center">
              <img src={hist} className="w-32 h-32 rounded-xl" />
              <div>
                <h3 className="text-xl text-white font-semibold mb-2">
                  Histogram Plot
                </h3>

                <ul className="list-disc ml-5">
                  <li>Most features are normally distributed</li>
                  <li>Area_mean is right skewed</li>
                  <li>Concavity_mean is highly skewed</li>
                  <li>Smoothness_mean is evenly distributed</li>
                </ul>
              </div>
            </div>

          </div>
        </div>

        {/* Workflow */}
        <div className="bg-[#111827]/90 rounded-3xl p-6 mb-6 border border-white/10">
          <h2 className="text-2xl font-semibold mb-4">
            Final Workflow
          </h2>

          <p className="text-gray-300 text-lg leading-8 text-center">
            Doctor/Nurse Login → Enter Patient Details → Enter Tumor Features →
            ML Prediction → PDF Report Generation → History Storage
          </p>
        </div>

        {/* Back Button */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-block px-6 py-3 rounded-xl
                       bg-purple-600 hover:bg-purple-700
                       transition font-semibold"
          >
            Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}