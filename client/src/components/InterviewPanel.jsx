import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import HiringReport from "./HiringReport";

function InterviewPanel({ questions = [] }) {
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [input, setInput] = useState("");
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scores, setScores] = useState([]);
  const [report, setReport] = useState(null);
  const [listening, setListening] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [voiceAvailable, setVoiceAvailable] = useState(false);

  const recognitionRef = useRef(null);
  const inputRef = useRef("");
  const voiceTranscriptRef = useRef("");
  const activeQuestionIndexRef = useRef(0);
  const completedRef = useRef(false);
  const loadingRef = useRef(false);

  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: questions.length > 0 ? questions[0] : "Tell me about yourself.",
    },
  ]);

  const speak = (text) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (messages.length > 0 && messages[0].sender === "ai") {
      speak(messages[0].text);
    }
  }, []);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setVoiceAvailable(Boolean(SpeechRecognition));

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    inputRef.current = input;
  }, [input]);

  useEffect(() => {
    activeQuestionIndexRef.current = activeQuestionIndex;
  }, [activeQuestionIndex]);

  useEffect(() => {
    completedRef.current = completed;
  }, [completed]);

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setListening(false);
  };

  const startListening = () => {
    if (listening) {
      stopListening();
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceError("Voice input is not supported in this browser.");
      setVoiceAvailable(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onstart = () => {
      setListening(true);
      setVoiceError("");
      setVoiceTranscript("");
      voiceTranscriptRef.current = "";
    };

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        transcript += event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          const normalized = transcript.trim();
          if (normalized) {
            voiceTranscriptRef.current = normalized;
            setVoiceTranscript(normalized);
            setInput(normalized);
            inputRef.current = normalized;
          }
        }
      }
    };

    recognition.onerror = (event) => {
      let message = `Voice input error: ${event.error}`;
      if (event.error === "not-allowed") {
        message = "Microphone access was blocked. Please allow microphone permission and try again.";
      } else if (event.error === "network") {
        message = "Voice input is unavailable right now because the speech service could not be reached. You can type your answer manually instead.";
      } else if (event.error === "audio-capture") {
        message = "Your microphone could not be accessed. Please check that a microphone is connected and available.";
      } else if (event.error === "not-supported") {
        message = "Voice input is not supported in this browser. Please use Chrome or Edge.";
      } else if (event.error === "aborted") {
        message = "Voice capture was stopped before a result was produced.";
      }

      setVoiceError(message);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
      if (recognitionRef.current === recognition) {
        recognitionRef.current = null;
      }

      const answer = voiceTranscriptRef.current.trim();
      if (answer) {
        setInput(answer);
        inputRef.current = answer;
        setTimeout(() => {
          sendMessage(answer);
        }, 200);
      } else {
        setVoiceError("No speech was captured. Please try again and speak clearly.");
      }
    };

    recognition.onnomatch = () => {
      setVoiceError("No speech was recognized. Please try again.");
      setListening(false);
    };

    setVoiceError("");
    recognition.start();
    recognitionRef.current = recognition;
  };

  const sendMessage = async (overrideAnswer = "") => {
    const rawAnswer = typeof overrideAnswer === "string" && overrideAnswer.length > 0 ? overrideAnswer : inputRef.current || input;
    const answerText = rawAnswer.trim();

    if (!answerText || completedRef.current || loadingRef.current) return;

    const answer = answerText;

    setMessages((prev) => [...prev, { sender: "user", text: answer }]);
    setInput("");
    inputRef.current = "";
    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL;

      const res = await fetch(`${API_URL}/api/interview/evaluate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: questions[activeQuestionIndexRef.current],
          answer,
        }),
      });

      const data = await res.json();

      if (data.success) {
        const score = Number(data.result.score);
        const newScores = [...scores, score];
        setScores(newScores);

        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: `⭐ Score: ${score}/10\n\n💬 Feedback:\n\n${data.result.feedback}`,
          },
        ]);

        if (activeQuestionIndexRef.current === questions.length - 1) {
          const average = newScores.reduce((a, b) => a + b, 0) / newScores.length;
          const recommendationText = typeof data.result?.recommendation === "string" && data.result.recommendation.trim()
            ? data.result.recommendation.trim()
            : average >= 8
              ? "Strong Hire"
              : average >= 6
                ? "Hire"
                : average >= 4
                  ? "Consider"
                  : "Reject";

          setReport({
            score: average.toFixed(1),
            recommendation: recommendationText,
            questionScores: newScores,
            strengths: Array.isArray(data.result?.strengths) && data.result.strengths.length > 0
              ? data.result.strengths
              : ["Relevant perspective", "Clear intent"],
            improvements: Array.isArray(data.result?.improvements) && data.result.improvements.length > 0
              ? data.result.improvements
              : ["Add concrete examples", "Explain your reasoning more clearly"],
          });
        }
      }

      const nextIndex = activeQuestionIndexRef.current + 1;

      if (nextIndex < questions.length) {
        setMessages((prev) => [...prev, { sender: "ai", text: questions[nextIndex] }]);
        speak(questions[nextIndex]);
        setActiveQuestionIndex(nextIndex);
        activeQuestionIndexRef.current = nextIndex;
      } else {
        setMessages((prev) => [...prev, { sender: "ai", text: "🎉 Interview Completed!\n\nThank you for participating." }]);
        speak("Interview completed. Thank you for participating.");
        setCompleted(true);
      }
    } catch (error) {
      console.error("Interview evaluation failed:", error);
      setMessages((prev) => [...prev, { sender: "ai", text: "⚠️ Something went wrong while evaluating your answer. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const progress = questions.length > 0 ? ((completed ? questions.length : activeQuestionIndex) / questions.length) * 100 : 0;

  return (
    <>
      <div className="mt-8 rounded-[32px] border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/20 backdrop-blur-lg">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Step 3</p>
            <h2 className="mt-2 text-3xl font-semibold text-emerald-300">AI Interview Session</h2>
            <p className="mt-3 text-slate-300">Ask, answer, and receive evaluation in a single guided flow.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-300">
              Question {Math.min(activeQuestionIndex + 1, questions.length)} of {questions.length}
            </div>
            <div className="rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-2 text-sm font-medium text-sky-300">
              {completed ? "Completed" : loading ? "Evaluating" : "Live"}
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-[24px] border border-white/10 bg-slate-950/70 p-4">
          <div className="mb-4 flex items-center justify-between text-sm text-slate-400">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 rounded-full bg-slate-800">
            <div className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-green-400 transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="mt-6 rounded-[24px] border border-white/10 bg-slate-950/70 p-4">
          <div className="h-[420px] overflow-y-auto space-y-3 pr-1">
            <AnimatePresence initial={false}>
              {messages.map((msg, index) => (
                <motion.div
                  key={`${msg.sender}-${index}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`max-w-[85%] rounded-2xl px-4 py-3 whitespace-pre-wrap ${msg.sender === "ai" ? "mr-auto bg-slate-900 text-slate-100" : "ml-auto bg-emerald-600 text-white"}`}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] opacity-70">{msg.sender === "ai" ? "HireMind AI" : "You"}</p>
                  <p className="mt-1 text-sm leading-7">{msg.text}</p>
                </motion.div>
              ))}
            </AnimatePresence>

            {loading && (
              <div className="mr-auto max-w-[85%] rounded-2xl bg-slate-900 px-4 py-3 text-sm text-slate-200">
                Evaluating your answer...
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 rounded-[24px] border border-white/10 bg-slate-950/70 p-4">
          <div className="flex flex-col gap-3 lg:flex-row">
            <input
              type="text"
              className="flex-1 rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-slate-100 outline-none ring-0 placeholder:text-slate-400"
              placeholder={completed ? "Interview Completed" : "Type your answer..."}
              value={input}
              disabled={completed || loading}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
            />
            <div className="flex gap-2">
              <button onClick={() => sendMessage()} disabled={completed || loading} className={`rounded-2xl px-4 py-3 font-semibold text-white transition ${completed ? "cursor-not-allowed bg-slate-700" : loading ? "bg-sky-700" : "bg-emerald-600 hover:bg-emerald-500"}`}>
                {completed ? "Completed" : loading ? "Evaluating..." : "Send"}
              </button>
              <button onClick={startListening} disabled={completed || loading} className={`rounded-2xl px-4 py-3 font-semibold text-white transition ${listening ? "bg-purple-800 hover:bg-purple-900" : "bg-violet-600 hover:bg-violet-500"}`}>
                {listening ? "Stop" : "Speak"}
              </button>
            </div>
          </div>

          {voiceError && <p className="mt-3 text-sm text-rose-300">{voiceError}</p>}
          {!voiceAvailable && !voiceError && <p className="mt-3 text-sm text-slate-400">Voice input is not available in this browser. You can still type your answer.</p>}
          {voiceTranscript && !voiceError && <p className="mt-3 text-sm text-emerald-300">Captured: {voiceTranscript}</p>}
        </div>
      </div>

      {completed && report && <HiringReport report={report} />}
    </>
  );
}

export default InterviewPanel;