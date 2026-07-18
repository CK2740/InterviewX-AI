function Navbar() {
  return (
    <nav className="flex justify-between items-center px-10 py-6 border-b border-slate-700">
      <h1 className="text-2xl font-bold text-blue-400">
        HireMind AI
      </h1>

      <button className="bg-blue-500 hover:bg-blue-600 transition px-5 py-2 rounded-lg">
        Start Interview
      </button>
    </nav>
  );
}

export default Navbar;