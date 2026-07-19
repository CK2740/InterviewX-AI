import { useState } from "react";
import ResumeAnalysis from "./ResumeAnalysis";
import InterviewPanel from "./InterviewPanel";

function ResumeUpload() {
  console.log("API URL:", import.meta.env.VITE_API_URL);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [showInterview, setShowInterview] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const startInterview = () => {
    setShowInterview(true);
  };

  const resetFlow = () => {
    setFile(null);
    setMessage("");
    setAnalysis(null);
    setShowInterview(false);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a resume first.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setIsUploading(true);
      setMessage("Analyzing resume and preparing questions...");

      const API_URL = import.meta.env.VITE_API_URL;

      const res = await fetch(`${API_URL}/api/upload/upload-resume`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setAnalysis(data.analysis);
        setShowInterview(false);
        setMessage("Resume analyzed successfully.");
      } else {
        setMessage(data.message || "Unable to analyze the resume right now.");
      }
    } catch (error) {
      setMessage("Server error. Please try again in a moment.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div id="upload" className="min-h-screen px-4 py-8 text-slate-50 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.22),_transparent_35%),linear-gradient(135deg,_rgba(2,6,23,0.96),_rgba(15,23,42,0.95))] p-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.55)] backdrop-blur-xl">
          <div className="absolute -top-12 right-0 h-40 w-40 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-sky-500/20 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-300">
                AI Hiring Copilot
              </div>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Turn a resume into a polished, AI-led interview experience.
              </h1>
              <p className="mt-4 text-lg text-slate-300">
                Upload a candidate PDF, inspect the profile, and move straight into an intelligent interview flow.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm">
                <p className="text-slate-400">Resume Analysis</p>
                <p className="mt-1 text-xl font-semibold text-emerald-300">Instant</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm">
                <p className="text-slate-400">Interview Flow</p>
                <p className="mt-1 text-xl font-semibold text-sky-300">Live</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm">
                <p className="text-slate-400">Hiring Report</p>
                <p className="mt-1 text-xl font-semibold text-violet-300">Ready</p>
              </div>
            </div>
          </div>
        </header>

        <section className="rounded-[32px] border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/20 backdrop-blur-lg">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Step 1</p>
              <h2 className="mt-2 text-2xl font-semibold">Upload Resume</h2>
            </div>
            <div className={`rounded-full px-3 py-1 text-sm font-medium ${file ? "bg-emerald-500/15 text-emerald-300" : "bg-slate-800 text-slate-300"}`}>
              {file ? "Selected" : "Pending"}
            </div>
          </div>

          <label className="group flex min-h-[270px] cursor-pointer flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-slate-700 bg-slate-950/70 p-8 text-center transition hover:border-emerald-400 hover:bg-slate-800/80">
            {file ? (
              <div className="space-y-3">
                <div className="text-5xl">📄</div>
                <div className="text-lg font-semibold text-emerald-300">{file.name}</div>
                <p className="text-sm text-slate-400">This file is ready for AI analysis.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-5xl transition group-hover:scale-110">📂</div>
                <p className="text-xl font-semibold text-slate-100">Upload your resume</p>
                <p className="text-sm text-slate-400">Drag and drop or browse for a PDF file</p>
              </div>
            )}

            <input type="file" accept=".pdf" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </label>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button onClick={handleUpload} disabled={isUploading} className="flex-1 rounded-2xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-70">
              {isUploading ? "Analyzing..." : "Analyze Resume"}
            </button>
            <button onClick={resetFlow} className="rounded-2xl border border-white/10 bg-slate-800 px-5 py-3 font-semibold text-slate-200 transition hover:bg-slate-700">
              Reset
            </button>
          </div>

          {message && (
            <div className={`mt-5 rounded-2xl border px-4 py-3 text-sm ${message.includes("success") || message.includes("ready") ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" : "border-sky-500/30 bg-sky-500/10 text-sky-300"}`}>
              {message}
            </div>
          )}
        </section>

        {analysis && (
          <div className="mt-2">
            <ResumeAnalysis analysis={analysis} onStartInterview={startInterview} />
          </div>
        )}

        {showInterview && analysis?.questions?.length > 0 && (
          <div className="mt-2">
            <InterviewPanel questions={analysis.questions} />
          </div>
        )}
      </div>
    </div>
  );
}

export default ResumeUpload;