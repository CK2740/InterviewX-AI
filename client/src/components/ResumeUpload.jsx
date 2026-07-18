import { useState } from "react";
import API from "../services/api";

function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    const selected = e.target.files[0];

    if (!selected) return;

    setFile(selected);
    setFileName(selected.name);
    setMessage("");
  };

  const uploadResume = async () => {
    if (!file) {
      alert("Please choose a PDF first.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
  setLoading(true);

  const res = await API.post("/upload-resume", formData);

  setMessage(res.data.message);
} catch (err) {
  console.error(err);

  if (err.response) {
    console.log(err.response.data);
    setMessage(err.response.data.message);
  } else {
    setMessage(err.message);
  }
} finally {
  setLoading(false);
}
  };

  return (
    <section className="py-20 px-6 bg-slate-950">
      <div className="max-w-4xl mx-auto">

        <h2 className="text-4xl font-bold text-center mb-4">
          Upload Your Resume
        </h2>

        <p className="text-gray-400 text-center mb-10">
          Upload your resume and let HireMind AI generate a personalized interview.
        </p>

        <div className="bg-slate-800 border-2 border-dashed border-slate-600 rounded-2xl p-10 text-center">

          <div className="text-6xl mb-5">📄</div>

          <label className="cursor-pointer bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-xl font-semibold">
            Choose Resume

            <input
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          {fileName && (
            <>
              <p className="mt-6 text-green-400">
                ✅ {fileName}
              </p>

              <button
                onClick={uploadResume}
                disabled={loading}
                className="mt-6 bg-green-500 hover:bg-green-600 px-6 py-3 rounded-xl font-semibold"
              >
                {loading ? "Uploading..." : "🚀 Generate My Interview"}
              </button>
            </>
          )}

          {message && (
            <p className="mt-6 text-blue-400 font-semibold">
              {message}
            </p>
          )}

        </div>
      </div>
    </section>
  );
}

export default ResumeUpload;