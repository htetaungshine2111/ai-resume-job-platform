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
  "resumeScore": 0,
  "strengths": [],
  "weaknesses": [],
  "missingSkills": [],
  "atsImprovements": [],
  "careerSuggestions": []
}

resumeScore should be a number from 0 to 100.

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
        resumeScore: feedback.resumeScore,
        userId: req.user.userId,
      },
    });

    res.json({
      message: "AI feedback generated successfully",
      feedback,
    });
  } catch (error) {
    console.error("AI FEEDBACK ERROR:", error);

    if (error.status === 503 || error.status === 429) {
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
        title: "AI Cover Letter",
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
    if (error.status === 503 || error.status === 429) {
      return res.json({
        message: "AI is busy, showing fallback questions",
        questions: `
Technical Questions:
1. Can you explain your experience with backend API development?
2. How would you design a user authentication system with JWT?
3. How do you handle database relationships using Prisma?
4. What is the difference between frontend state and backend persistence?
5. How would you deploy a full-stack app using Vercel, Render, and Supabase?

Behavioral Questions:
1. Tell me about a difficult bug you solved.
2. Describe a time you learned a new technology quickly.
3. How do you handle feedback from teammates?
4. Tell me about a project you are proud of.
5. How do you manage tasks when deadlines are tight?

Project Discussion Questions:
1. How did you build your AI Resume & Career Platform?
2. Why did you choose React, Node.js, Prisma, and PostgreSQL?
3. How did you integrate Gemini AI into your application?
    `,
      });
    }

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
        title: true,
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

    await prisma.resumeAnalysis.create({
      data: {
        title: "AI Interview Questions",
        fileName: "AI Interview Questions",
        resumeText,
        jobDescription,
        interviewTitle: "AI Interview Questions",
        interviewQuestions: questions,

        summary: "AI-generated interview questions",
        skills: [],
        missingSkills: [],
        suggestions: [],
        jobRoles: [],

        userId: req.user.userId,
      },
    });

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

router.delete("/cover-letters/:id", authMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.id);

    const existingCoverLetter = await prisma.resumeAnalysis.findFirst({
      where: {
        id,
        userId: req.user.userId,
      },
    });

    if (!existingCoverLetter) {
      return res.status(404).json({
        message: "Cover letter not found",
      });
    }

    await prisma.resumeAnalysis.delete({
      where: {
        id,
      },
    });

    res.json({
      message: "Cover letter deleted successfully",
    });
  } catch (error) {
    if (error.status === 503 || error.status === 429) {
      return res.json({
        message: "AI is busy, showing fallback questions",
        questions: `
Technical Questions:
1. Can you explain your experience with backend API development?
2. How would you design a user authentication system with JWT?
3. How do you handle database relationships using Prisma?
4. What is the difference between frontend state and backend persistence?
5. How would you deploy a full-stack app using Vercel, Render, and Supabase?

Behavioral Questions:
1. Tell me about a difficult bug you solved.
2. Describe a time you learned a new technology quickly.
3. How do you handle feedback from teammates?
4. Tell me about a project you are proud of.
5. How do you manage tasks when deadlines are tight?

Project Discussion Questions:
1. How did you build your AI Resume & Career Platform?
2. Why did you choose React, Node.js, Prisma, and PostgreSQL?
3. How did you integrate Gemini AI into your application?
    `,
      });
    }

    console.error("DELETE COVER LETTER ERROR:", error);

    res.status(500).json({
      message: "Failed to delete cover letter",
    });
  }
});

router.patch("/cover-letters/:id", authMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title } = req.body;

    const existingCoverLetter = await prisma.resumeAnalysis.findFirst({
      where: {
        id,
        userId: req.user.userId,
      },
    });

    if (!existingCoverLetter) {
      return res.status(404).json({
        message: "Cover letter not found",
      });
    }

    const updatedCoverLetter = await prisma.resumeAnalysis.update({
      where: {
        id,
      },
      data: {
        title,
      },
    });

    res.json(updatedCoverLetter);
  } catch (error) {
    console.error("UPDATE COVER LETTER ERROR:", error);

    res.status(500).json({
      message: "Failed to update cover letter",
    });
  }
});

router.post("/ai-evaluate-answer", authMiddleware, async (req, res) => {
  try {
    const { question, answer } = req.body;

    if (!question || !answer) {
      return res.status(400).json({
        message: "Question and answer are required",
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
    });

    const prompt = `
Evaluate this interview answer.

Return:
- score from 0 to 100
- strengths
- weaknesses
- improved answer

Question:
${question}

Answer:
${answer}
`;

    const result = await model.generateContent(prompt);
    const feedback = result.response.text();

    res.json({
      message: "Answer evaluated successfully",
      feedback,
    });
  } catch (error) {
    console.error("ANSWER EVALUATION ERROR:", error);

    res.status(500).json({
      message: "Answer evaluation failed",
    });
  }
});

router.get("/interview-questions", authMiddleware, async (req, res) => {
  try {
    const interviews = await prisma.resumeAnalysis.findMany({
      where: {
        userId: req.user.userId,
        interviewQuestions: {
          not: null,
        },
      },
      select: {
        id: true,
        interviewTitle: true,
        jobDescription: true,
        interviewQuestions: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(interviews);
  } catch (error) {
    console.error("GET INTERVIEW QUESTIONS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch interview questions",
    });
  }
});

router.delete("/interview-questions/:id", authMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.id);

    const existingInterview = await prisma.resumeAnalysis.findFirst({
      where: {
        id,
        userId: req.user.userId,
      },
    });

    if (!existingInterview) {
      return res.status(404).json({
        message: "Interview questions not found",
      });
    }

    await prisma.resumeAnalysis.delete({
      where: {
        id,
      },
    });

    res.json({
      message: "Interview questions deleted successfully",
    });
  } catch (error) {
    console.error("DELETE INTERVIEW QUESTIONS ERROR:", error);

    res.status(500).json({
      message: "Failed to delete interview questions",
    });
  }
});

router.put("/interview-questions/:id", authMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { interviewTitle } = req.body;

    const interview = await prisma.resumeAnalysis.findFirst({
      where: {
        id,
        userId: req.user.userId,
      },
    });

    if (!interview) {
      return res.status(404).json({
        message: "Interview questions not found",
      });
    }

    const updatedInterview = await prisma.resumeAnalysis.update({
      where: {
        id,
      },
      data: {
        interviewTitle,
      },
    });

    res.json(updatedInterview);
  } catch (error) {
    console.error("UPDATE INTERVIEW ERROR:", error);

    res.status(500).json({
      message: "Failed to update interview title",
    });
  }
});

module.exports = router;
