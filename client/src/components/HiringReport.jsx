import jsPDF from "jspdf";

function HiringReport({ report }) {
  if (!report) return null;

  const toneClass =
    report.recommendation?.toLowerCase().includes("strong")
      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
      : report.recommendation?.toLowerCase().includes("hire")
        ? "border-sky-500/30 bg-sky-500/10 text-sky-300"
        : report.recommendation?.toLowerCase().includes("consider")
          ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
          : "border-rose-500/30 bg-rose-500/10 text-rose-300";

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFillColor(2, 6, 23);
    doc.rect(0, 0, 210, 297, "F");

    doc.setFillColor(16, 185, 129);
    doc.roundedRect(18, 18, 174, 90, 8, 8, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("HireMind AI", 32, 44);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text("Hiring Intelligence Report", 32, 58);

    doc.setFontSize(10);
    doc.text("AI-generated interview evaluation summary", 32, 74);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Candidate Evaluation", 32, 96);

    doc.setTextColor(248, 250, 252);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text("Prepared for your hiring team", 32, 110);

    doc.setDrawColor(16, 185, 129);
    doc.setLineWidth(0.6);
    doc.line(20, 125, 190, 125);

    doc.setFillColor(15, 23, 42);
    doc.roundedRect(20, 132, 170, 38, 4, 4, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Overall Score", 30, 150);
    doc.setFontSize(24);
    doc.text(`${report.score}/10`, 30, 166);

    doc.setFontSize(11);
    doc.setTextColor(110, 231, 183);
    doc.text(`Recommendation: ${report.recommendation}`, 110, 150);

    let y = 188;
    doc.setTextColor(248, 250, 252);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Question Scores", 20, y);

    y += 8;
    report.questionScores.forEach((score, index) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text(`Q${index + 1}: ${score}/10`, 25, y + 8);
      doc.setDrawColor(51, 65, 85);
      doc.roundedRect(25, y + 12, 150, 6, 2, 2, "S");
      doc.setFillColor(16, 185, 129);
      doc.roundedRect(25, y + 12, (score / 10) * 150, 6, 2, 2, "F");
      y += 18;
    });

    y += 6;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Strengths", 20, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    report.strengths.forEach((item) => {
      doc.text(`• ${item}`, 25, y);
      y += 7;
    });

    y += 4;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Areas to Improve", 20, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    report.improvements.forEach((item) => {
      doc.text(`• ${item}`, 25, y);
      y += 7;
    });

    doc.save("HireMind_Report.pdf");
  };

  return (
    <section className="mt-8 rounded-[32px] border border-white/10 bg-slate-900/70 p-8 shadow-2xl shadow-black/20 backdrop-blur-lg">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Final Outcome</p>
          <h2 className="mt-2 text-3xl font-semibold text-emerald-300">AI Hiring Report</h2>
          <p className="mt-3 text-slate-300">A concise summary of the candidate’s interview performance.</p>
        </div>
        <div className={`rounded-full border px-4 py-2 text-sm font-semibold ${toneClass}`}>
          {report.recommendation}
        </div>
      </div>

      <div className="mt-8 rounded-[28px] border border-white/10 bg-gradient-to-br from-emerald-500/15 via-slate-950/80 to-sky-500/10 p-6 text-center shadow-inner shadow-emerald-500/10">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Overall Score</p>
        <div className="mt-4 flex items-center justify-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-emerald-400/30 bg-slate-950/70 text-4xl font-semibold text-emerald-300 shadow-lg shadow-emerald-500/10">
            {report.score}
          </div>
          <div className="text-left">
            <p className="text-2xl font-semibold text-slate-100">{report.score}/10</p>
            <p className="text-sm text-slate-400">Interview readiness snapshot</p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-[24px] border border-white/10 bg-slate-950/60 p-5">
          <h3 className="text-xl font-semibold text-slate-100">📈 Question Scores</h3>
          <div className="mt-4 space-y-3">
            {report.questionScores.map((score, index) => (
              <div key={index} className="rounded-2xl border border-white/10 bg-slate-900/70 p-3">
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span>Question {index + 1}</span>
                  <span className="font-semibold text-emerald-300">{score}/10</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-slate-800">
                  <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${(score / 10) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[24px] border border-white/10 bg-slate-950/60 p-5">
            <h3 className="text-xl font-semibold text-emerald-300">✅ Strengths</h3>
            <ul className="mt-3 space-y-2 text-slate-300">
              {report.strengths.map((item, index) => <li key={index}>• {item}</li>)}
            </ul>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-slate-950/60 p-5">
            <h3 className="text-xl font-semibold text-rose-300">📚 Areas to Improve</h3>
            <ul className="mt-3 space-y-2 text-slate-300">
              {report.improvements.map((item, index) => <li key={index}>• {item}</li>)}
            </ul>
          </div>
        </div>
      </div>

      <button onClick={downloadPDF} className="mt-8 w-full rounded-2xl bg-sky-600 px-5 py-4 text-lg font-semibold text-white transition hover:bg-sky-500">
        📄 Download Hiring Report
      </button>
    </section>
  );
}

export default HiringReport;