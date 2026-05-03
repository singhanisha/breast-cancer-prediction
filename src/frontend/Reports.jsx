import { useEffect, useState } from "react";
import bgImage from "../assets/bgimage.jpg";

export default function Reports() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/history")
      .then(res => res.json())
      .then(result => setData(result.data));
  }, []);

  return (
    <div
      className="min-h-screen p-6 bg-cover bg-center"
      style={{
        backgroundImage: `
          linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)),
          url(${bgImage})
        `,
      }}
    >
      <h2 className="text-3xl text-white text-center mb-6 font-bold">
        Patient Reports
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-white bg-[#0f172a]/90 rounded-xl overflow-hidden">
          <thead className="bg-[#1e293b]">
            <tr className="text-center">
              <th className="p-4">Name</th>
              <th className="p-4">Mobile</th>
              <th className="p-4">Date</th>
              <th className="p-4">Result</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => {
              const fileName = item[16]?.split("/").pop(); // pdfPath

              return (
                <tr key={index} className="border-b border-gray-700 text-center">
                  <td className="p-4">{item[1]}</td>
                  <td>{item[4]}</td>
                  <td>{item[6]}</td>

                  <td className={
                    item[15] === "Malignant"
                      ? "text-red-400 font-bold"
                      : "text-green-400 font-bold"
                  }>
                    {item[15]}
                  </td>

                  <td className="flex gap-2 py-2">

                    {/* VIEW */}
                    <button
                      onClick={() =>
                        window.open(`http://127.0.0.1:5000/view-report/${fileName}`)
                      }
                      className="px-3 py-1 bg-indigo-500 rounded hover:scale-105"
                    >
                      View
                    </button>

                    {/* DOWNLOAD */}
                    <button
                      onClick={() =>
                        window.open(`http://127.0.0.1:5000/download-report/${fileName}`)
                      }
                      className="px-3 py-1 bg-green-600 rounded hover:scale-105"
                    >
                      Download
                    </button>

                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}