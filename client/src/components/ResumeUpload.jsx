import { useState } from "react";

function ResumeUpload() {
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  return (
    <section className="py-20 px-6 bg-slate-950">
      <div className="max-w-4xl mx-auto">

        <h2 className="text-4xl font-bold text-center mb-4">
          Upload Your Resume
        </h2>

        <p className="text-gray-400 text-center mb-10">
          Upload your resume and let HireMind AI create a personalized interview.
        </p>

        <div className="bg-slate-800 border-2 border-dashed border-slate-600 rounded-2xl p-10 text-center hover:border-blue-500 transition">

          <div className="text-6xl mb-5">📄</div>

          <h3 className="text-2xl font-semibold mb-4">
            Drag & Drop Resume
          </h3>

          <p className="text-gray-400 mb-6">
            or choose a PDF file from your computer
          </p>

          <label className="cursor-pointer bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-xl font-semibold transition">
            Choose Resume

            <input
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          {fileName && (
            <div className="mt-8 bg-slate-700 rounded-xl p-4">
              <p className="text-green-400 font-semibold">
                ✅ {fileName}
              </p>

              <button className="mt-4 bg-green-500 hover:bg-green-600 px-6 py-2 rounded-lg font-semibold transition">
                Analyze Resume
              </button>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}

export default ResumeUpload;