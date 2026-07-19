import express from "express";
import multer from "multer";
import fs from "fs";
import pdfParse from "pdf-parse";
import { analyzeResume } from "../utils/groq.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/upload-resume", upload.single("resume"), async (req, res) => {

    try {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
        }

        const dataBuffer = fs.readFileSync(req.file.path);

        const pdfData = await pdfParse(dataBuffer);
        const analysis = await analyzeResume(pdfData.text);

       res.json({
        success: true,
        message: "Resume analyzed successfully!",
        file: req.file.filename,
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