function Navbar() {
  return (
    <nav className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-lg font-semibold text-emerald-300">HireMind AI</p>
          <p className="text-sm text-slate-400">AI interview copilot for modern hiring</p>
        </div>

        <div className="hidden items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 md:flex">
          <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-emerald-300">Resume AI</span>
          <span className="rounded-full bg-sky-500/15 px-2.5 py-1 text-sky-300">Live Interview</span>
          <span className="rounded-full bg-violet-500/15 px-2.5 py-1 text-violet-300">Hiring Report</span>
        </div>

        <a href="#upload" className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500">
          Start Now
        </a>
      </div>
    </nav>
  );
}

export default Navbar;