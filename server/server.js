import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import uploadRoute from "./routes/upload.js";
import interviewRoutes from "./routes/interview.js";

dotenv.config();

console.log("GROQ exists:", !!process.env.GROQ_API_KEY);

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/upload", uploadRoute);
app.use("/api/interview", interviewRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "HireMind AI Backend Running 🚀",
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});