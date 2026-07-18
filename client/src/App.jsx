import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ResumeUpload from "./components/ResumeUpload";

function App() {
  return (
    <div className="bg-slate-900 text-white min-h-screen">
      <Navbar />
      <Hero />
      <ResumeUpload />
    </div>
  );
}

export default App;