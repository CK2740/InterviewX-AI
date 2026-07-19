import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

function getFallbackResult(question, answer) {
  const cleaned = (answer || "").trim();
  const words = cleaned.split(/\s+/).filter(Boolean).length;
  const hasSpecificity = /because|example|for example|however|while|when|since|team|project|debug|error|solution/i.test(cleaned);

  let score = 2;
  if (words >= 20) score = 6;
  if (words >= 35 && hasSpecificity) score = 8;
  if (words >= 50 && hasSpecificity) score = 9;
  if (!cleaned) score = 1;

  const feedback = cleaned
    ? "Your answer was relevant, but it would be stronger with clearer structure, more concrete examples, and a direct explanation of your reasoning."
    : "Please provide a fuller answer so the interviewer can assess your reasoning clearly.";

  return {
    score,
    feedback,
    recommendation: score >= 8 ? "Strong Hire" : score >= 6 ? "Hire" : score >= 4 ? "Consider" : "Reject",
    strengths: ["Relevant perspective", "Clear intent"],
    improvements: ["Add concrete examples", "Explain your reasoning more clearly"],
  };
}

function normalizeResult(rawResult, question, answer) {
  const fallback = getFallbackResult(question, answer);

  if (!rawResult || typeof rawResult !== "object") {
    return fallback;
  }

  const score = Number(rawResult.score);
  const safeScore = Number.isFinite(score) ? Math.max(0, Math.min(10, score)) : fallback.score;

  return {
    score: safeScore,
    feedback: typeof rawResult.feedback === "string" && rawResult.feedback.trim()
      ? rawResult.feedback.trim()
      : fallback.feedback,
    recommendation: typeof rawResult.recommendation === "string" && rawResult.recommendation.trim()
      ? rawResult.recommendation.trim()
      : fallback.recommendation,
    strengths: Array.isArray(rawResult.strengths) && rawResult.strengths.length > 0
      ? rawResult.strengths.slice(0, 3)
      : fallback.strengths,
    improvements: Array.isArray(rawResult.improvements) && rawResult.improvements.length > 0
      ? rawResult.improvements.slice(0, 3)
      : fallback.improvements,
  };
}

export async function evaluateAnswer(question, answer) {
  const fallback = getFallbackResult(question, answer);

  try {
    const prompt = `
You are an experienced technical interviewer.

Evaluate the candidate's answer.

Question:
${question}

Candidate Answer:
${answer}

Return ONLY valid JSON with this structure:
{
  "score": 0,
  "feedback": "",
  "recommendation": "",
  "strengths": [""],
  "improvements": [""]
}

Rules:
- Score must be between 0 and 10.
- feedback should be 2-3 sentences.
- recommendation should be one short label such as Strong Hire, Hire, Consider, or Reject.
- strengths and improvements should be short arrays of 2-3 items.
- Do not include markdown or code fences.
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });

    let response = completion.choices?.[0]?.message?.content?.trim() || "";
    response = response.replace(/```json/g, "").replace(/```/g, "").trim();

    const parsed = JSON.parse(response);
    return normalizeResult(parsed, question, answer);
  } catch (error) {
    console.error("Interview evaluation failed, using fallback:", error.message);
    return fallback;
  }
}