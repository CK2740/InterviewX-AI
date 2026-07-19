function ResumeAnalysis({ analysis, onStartInterview }) {
  if (!analysis) return null;

  const skills = Array.isArray(analysis.skills) ? analysis.skills : [];
  const projects = Array.isArray(analysis.projects) ? analysis.projects : [];

  return (
    <section className="rounded-[32px] border border-white/10 bg-slate-900/70 p-8 shadow-2xl shadow-black/20 backdrop-blur-lg">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Step 2</p>
          <h2 className="mt-2 text-3xl font-semibold text-emerald-300">AI Resume Analysis</h2>
          <p className="mt-3 max-w-2xl text-slate-300">
            A tailored summary of the candidate’s profile, strengths, and hiring potential.
          </p>
        </div>
        <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300">
          {analysis.recommendation || "Strong Hire Recommendation"}
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-[24px] border border-white/10 bg-slate-950/60 p-5">
          <h3 className="text-lg font-semibold text-slate-100">👤 Candidate</h3>
          <p className="mt-2 text-slate-300">{analysis.name || "Not provided"}</p>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-slate-950/60 p-5">
          <h3 className="text-lg font-semibold text-slate-100">🎓 Education</h3>
          <p className="mt-2 text-slate-300">{analysis.education || "Not provided"}</p>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-slate-950/60 p-5 md:col-span-2">
          <h3 className="text-lg font-semibold text-slate-100">🛠 Skills</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {skills.length > 0 ? (
              skills.map((skill) => (
                <span key={skill} className="rounded-full bg-emerald-600/20 px-4 py-2 text-sm font-medium text-emerald-300">
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-slate-400">No skills detected.</span>
            )}
          </div>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-slate-950/60 p-5">
          <h3 className="text-lg font-semibold text-slate-100">💼 Projects</h3>
          <div className="mt-2 space-y-2 text-slate-300">
            {projects.length > 0 ? (
              projects.map((project) => <p key={project}>• {project}</p>)
            ) : (
              <p>No projects detected.</p>
            )}
          </div>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-slate-950/60 p-5">
          <h3 className="text-lg font-semibold text-slate-100">⭐ Experience</h3>
          <p className="mt-2 text-slate-300">{analysis.experience || "Not provided"}</p>
          <h3 className="mt-5 text-lg font-semibold text-slate-100">🎯 Interview Level</h3>
          <p className="mt-2 text-slate-300">{analysis.level || "Not provided"}</p>
        </div>
      </div>

      <button onClick={onStartInterview} className="mt-8 w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-green-500 px-5 py-4 text-lg font-semibold text-white transition hover:from-emerald-500 hover:to-green-400">
        🚀 Start AI Interview
      </button>
    </section>
  );
}

export default ResumeAnalysis;