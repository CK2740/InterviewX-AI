import express from "express";
import multer from "multer";
import pdfParse from "pdf-parse";
import { analyzeResume } from "../utils/groq.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/upload-resume", upload.single("resume"), async (req, res) => {

    try {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
        }

        const pdfData = await pdfParse(req.file.buffer);
        const analysis = await analyzeResume(pdfData.text);

       res.json({
        success: true,
        message: "Resume analyzed successfully!",
        file: req.file.originalname,
        analysis: analysis
       });

    } catch(error){

    console.error("PDF ERROR:", error);

    res.status(500).json({
        success:false,
        message:error.message
    });
    }

});

export default router;