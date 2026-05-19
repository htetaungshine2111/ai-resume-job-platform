const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const prisma = require("../prismaClient");

router.post("/ai-resume-feedback", authMiddleware, async (req, res) => {
  try {
    const { resumeText } = req.body;

    if (!resumeText) {
      return res.status(400).json({
        message: "Resume text is required",
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
    });

    const prompt = `
Analyze this resume.

Return ONLY raw valid JSON.
Do not include markdown.
Do not include \`\`\`json.
Do not include explanation outside JSON.

Use this format:
{
  "strengths": [],
  "weaknesses": [],
  "missingSkills": [],
  "atsImprovements": [],
  "careerSuggestions": []
}

Resume:
${resumeText}
`;

    const result = await model.generateContent(prompt);

    const feedbackText = result.response.text();

    const cleanedFeedbackText = feedbackText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const feedback = JSON.parse(cleanedFeedbackText);

    await prisma.resumeAnalysis.create({
      data: {
        fileName: "AI Resume Feedback",
        resumeText,

        summary: "AI-generated resume feedback",
        skills: feedback.strengths || [],
        missingSkills: feedback.missingSkills || [],
        suggestions: feedback.atsImprovements || [],
        jobRoles: feedback.careerSuggestions || [],

        aiFeedback: JSON.stringify(feedback),

        userId: req.user.userId,
      },
    });

    res.json({
      message: "AI feedback generated successfully",
      feedback,
    });
  } catch (error) {
    console.error("AI FEEDBACK ERROR:", error);

    if (error.status === 429) {
      return res.json({
        message: "AI quota exceeded, showing fallback feedback",
        feedback: `
AI quota is currently unavailable, so this is fallback feedback.

Strengths:
- Good technical background
- Full-stack development experience
- Backend and API experience

Weaknesses:
- Add more measurable achievements
- Add more React/TypeScript projects
- Add cloud deployment details

Missing Skills:
- React
- TypeScript
- AWS
- Docker

ATS Improvements:
- Use clear job titles
- Add keywords from job descriptions
- Add project links

Career Suggestions:
- Apply for Full Stack Developer, Backend Developer, and Software Engineer roles.
    `,
      });
    }
    res.status(500).json({
      message: "AI feedback failed",
    });
  }
});

router.post("/ai-cover-letter", authMiddleware, async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({
        message: "Resume and job description are required",
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
    });

    const prompt = `
Generate a professional cover letter.

Use the resume and job description below.

Make it:
- professional
- concise
- personalized
- ATS-friendly

Resume:
${resumeText}

Job Description:
${jobDescription}
`;

    const result = await model.generateContent(prompt);

    const coverLetter = result.response.text();

    // console.log("Saving cover letter:", {
    //   jobDescription,
    //   coverLetter,
    //   userId: req.user.userId,
    // });

    await prisma.resumeAnalysis.create({
      data: {
        fileName: "AI Cover Letter",
        resumeText,
        jobDescription,
        coverLetter,

        summary: "AI-generated cover letter",
        skills: [],
        missingSkills: [],
        suggestions: [],
        jobRoles: [],

        userId: req.user.userId,
      },
    });

    res.json({
      message: "Cover letter generated successfully",

      coverLetter,
    });
  } catch (error) {
    console.error("COVER LETTER ERROR:", error);

    res.status(500).json({
      message: "Cover letter generation failed",
    });
  }
});

router.get("/cover-letters", authMiddleware, async (req, res) => {
  try {
    const coverLetters = await prisma.resumeAnalysis.findMany({
      where: {
        userId: req.user.userId,
        coverLetter: {
          not: null,
        },
      },
      select: {
        id: true,
        jobDescription: true,
        coverLetter: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(coverLetters);
  } catch (error) {
    console.error("GET COVER LETTERS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch cover letters",
    });
  }
});

router.post("/ai-interview-questions", authMiddleware, async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({
        message: "Resume and job description are required",
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
    });

    const prompt = `
Generate interview questions based on this resume and job description.

Return:
- 5 technical questions
- 5 behavioral questions
- 3 project discussion questions

Resume:
${resumeText}

Job Description:
${jobDescription}
`;

    const result = await model.generateContent(prompt);
    const questions = result.response.text();

    res.json({
      message: "Interview questions generated successfully",
      questions,
    });
  } catch (error) {
    console.error("INTERVIEW QUESTIONS ERROR:", error);

    res.status(500).json({
      message: "Interview questions generation failed",
    });
  }
});

module.exports = router;
