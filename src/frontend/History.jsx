import { useEffect, useState } from "react";
import bgImage from "../assets/bgimage.jpg";

export default function History() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/history")
      .then((res) => res.json())
      .then((result) => {
        setData(result.data || []);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

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
      <div className="max-w-7xl mx-auto text-white">

        <h1 className="text-3xl font-bold text-center mb-8">
          Patient History
        </h1>

        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0f172a]/90 shadow-lg">
          <table className="w-full text-left">

            <thead className="bg-purple-700 text-white">
              <tr>
                <th className="p-4">Patient Name</th>
                <th className="p-4">Age</th>
                <th className="p-4">Email</th>
                <th className="p-4">Mobile</th>
                <th className="p-4">Date</th>
                <th className="p-4">Staff Name</th>
                <th className="p-4">Role</th>
                <th className="p-4">Result</th>
              </tr>
            </thead>

            <tbody>
              {data.length > 0 ? (
                data.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-700 hover:bg-white/5"
                  >
                    {/* Correct Index Mapping */}

                    <td className="p-4">{item[1]}</td>   {/* patientName */}
                    <td className="p-4">{item[2]}</td>   {/* age */}
                    <td className="p-4">{item[3]}</td>   {/* email */}
                    <td className="p-4">{item[4]}</td>   {/* mobile */}
                    <td className="p-4">{item[6]}</td>   {/* date */}
                    <td className="p-4">{item[7]}</td>   {/* doctorName */}
                    <td className="p-4">{item[8]}</td>   {/* doctorRole */}

                    <td
                      className={`p-4 font-bold ${
                        item[15] === "Malignant"
                          ? "text-red-400"
                          : "text-green-400"
                      }`}
                    >
                      {item[15]}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center p-6 text-gray-300"
                  >
                    No patient history found
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}