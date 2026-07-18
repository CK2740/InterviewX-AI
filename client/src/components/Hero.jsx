import { motion } from "framer-motion";

function Hero() {
  return (
    <section className="min-h-[85vh] flex items-center justify-center px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">

        {/* Left Side */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-blue-400 font-semibold mb-3">
            🚀 AI Powered Interview Platform
          </p>

          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
            Crack Your Dream Job with
            <span className="text-blue-500"> HireMind AI</span>
          </h1>

          <p className="text-gray-400 text-lg mt-6">
            Practice personalized interviews, solve coding challenges,
            and receive an AI-generated hiring report just like a real
            company interview.
          </p>

          <div className="flex gap-5 mt-10">
            <button className="bg-blue-500 hover:bg-blue-600 px-8 py-4 rounded-xl font-semibold transition">
              Start Interview
            </button>

            <button className="border border-slate-600 hover:border-blue-500 px-8 py-4 rounded-xl transition">
              Learn More
            </button>
          </div>
        </motion.div>

        {/* Right Side */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="flex justify-center"
        >
          <div className="bg-slate-800 rounded-3xl p-8 shadow-2xl w-full max-w-md border border-slate-700">

            <h2 className="text-2xl font-bold text-blue-400 mb-6">
              AI Hiring Score
            </h2>

            <div className="space-y-5">

              <div>
                <div className="flex justify-between mb-1">
                  <span>Communication</span>
                  <span>88%</span>
                </div>

                <div className="w-full bg-slate-700 rounded-full h-3">
                  <div className="bg-blue-500 h-3 rounded-full w-[88%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span>Technical Skills</span>
                  <span>93%</span>
                </div>

                <div className="w-full bg-slate-700 rounded-full h-3">
                  <div className="bg-green-500 h-3 rounded-full w-[93%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span>Problem Solving</span>
                  <span>91%</span>
                </div>

                <div className="w-full bg-slate-700 rounded-full h-3">
                  <div className="bg-purple-500 h-3 rounded-full w-[91%]"></div>
                </div>
              </div>

            </div>

            <div className="mt-8 bg-blue-500 rounded-xl text-center py-4">
              <h3 className="text-3xl font-bold">91%</h3>
              <p>Strong Hire Recommendation</p>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}

export default Hero;