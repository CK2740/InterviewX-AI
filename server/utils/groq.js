import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const apiKey = process.env.GROQ_API_KEY;

if (!apiKey) {
  throw new Error(
    "GROQ_API_KEY is missing. Please check your server/.env file."
  );
}

const groq = new Groq({
  apiKey,
});

export async function analyzeResume(resumeText) {
  const prompt = `
Analyze the following resume.

Extract ALL available information.

If a value is missing, return:
- "Not Mentioned" for text fields
- [] for arrays

Return ONLY valid JSON.
Format:
{
  "name": "...",
  "education": "...",
  "skills": [],
  "projects": [],
  "experience": "...",
  "level": "...",
  "questions": [
    "...",
    "...",
    "...",
    "...",
    "..."
  ]
}
  Generate exactly 5 technical interview questions based on the candidate's resume.

The questions should:
- Focus on the candidate's projects.
- Focus on listed skills.
- Be suitable for the candidate's experience level.
- Return ONLY valid JSON.

Resume:
${resumeText}
`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.2,
    });

    const response = completion.choices[0].message.content;

    console.log("\n========== GROQ RESPONSE ==========\n");
    console.log(response);
    console.log("\n===================================\n");

    // Remove markdown if the model still returns it
    const cleanResponse = response
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleanResponse);

  } catch (error) {
    console.error("Groq Error:", error);
    throw error;
  }
}