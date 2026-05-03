import bgImage from "../assets/bgimage.jpg";
import { motion } from "framer-motion";

export default function PatientDashboard() {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat py-10 px-6"
      style={{
        backgroundImage: `
          linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)),
          url(${bgImage})
        `,
      }}
    >
      <div className="max-w-6xl mx-auto text-white">

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="p-8 rounded-3xl mb-8
                     bg-[#0f172a]/90
                     border border-white/10
                     shadow-[0_0_50px_rgba(168,85,247,0.25)]"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 leading-tight">
            Breast Cancer Awareness & Preventive Measures
          </h1>

          <p className="text-gray-300 text-center text-lg max-w-4xl mx-auto leading-relaxed">
            Early detection and a healthy lifestyle can significantly reduce
            the risk of breast cancer. This page helps patients understand
            preventive measures, warning signs, and healthy habits for better
            breast health and early medical support.
          </p>
        </motion.div>

        {/* Cards Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">

          {/* Preventive Measures */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-6 rounded-3xl
                       bg-[#111827]/90
                       border border-white/10
                       shadow-lg"
          >
            <div className="flex items-center gap-3 mb-5">
              <h2 className="text-2xl font-bold">Preventive Measures</h2>
            </div>

            <div className="space-y-3 text-gray-300 leading-relaxed">
              <p>• Maintain a healthy body weight</p>
              <p>• Exercise regularly (30 mins daily)</p>
              <p>• Avoid smoking and alcohol</p>
              <p>• Eat a balanced and nutritious diet</p>
              <p>• Get regular medical checkups</p>
              <p>• Self breast examination every month</p>
              <p>• Stay aware of family medical history</p>
              <p>• Consult a doctor for unusual symptoms</p>
            </div>
          </motion.div>

          {/* Warning Signs */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-6 rounded-3xl
                       bg-[#111827]/90
                       border border-white/10
                       shadow-lg"
          >
            <div className="flex items-center gap-3 mb-5">
              <h2 className="text-2xl font-bold">Warning Signs</h2>
            </div>

            <div className="space-y-3 text-gray-300 leading-relaxed">
              <p>• Lump in breast or underarm</p>
              <p>• Change in breast size or shape</p>
              <p>• Nipple pain or discharge</p>
              <p>• Skin redness or dimpling</p>
              <p>• Swelling in part of the breast</p>
              <p>• Unusual pain in breast area</p>
              <p>• Sudden inverted nipple</p>
              <p>• Persistent irritation or itching</p>
            </div>
          </motion.div>
        </div>

        {/* Healthy Lifestyle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="p-8 rounded-3xl mb-8
                     bg-[#0f172a]/90
                     border border-white/10
                     shadow-[0_0_40px_rgba(99,102,241,0.18)]"
        >
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-3xl font-bold">Healthy Lifestyle Tips</h2>
          </div>

          <p className="text-gray-300 text-lg leading-relaxed">
            A healthy lifestyle plays a major role in reducing breast cancer
            risk. Focus on proper nutrition, regular exercise, stress
            management, quality sleep, and avoiding harmful habits like smoking.
            Regular screenings and early medical consultation improve outcomes
            significantly.
          </p>
        </motion.div>

        {/* Important Note */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="p-6 rounded-3xl
                     bg-[#111827]/95
                     border border-purple-400
                     shadow-[0_0_30px_rgba(168,85,247,0.2)]"
        >
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-2xl font-bold">Important Note</h2>
          </div>

          <p className="text-gray-300 leading-relaxed">
            This system provides awareness and support information only.
            It does not replace professional medical diagnosis. Always consult
            a qualified doctor for medical advice, screening, and treatment.
          </p>
        </motion.div>

      </div>
    </div>
  );
}
