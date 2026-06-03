const express = require("express");
const prisma = require("../prismaClient");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/dashboard-stats", authMiddleware, async (req, res) => {
  try {
    const totalResumes = await prisma.resumeAnalysis.count();

    const totalMatches = await prisma.jobMatch.count();

    const matches = await prisma.jobMatch.findMany();

    const averageMatchScore =
      matches.length === 0
        ? 0
        : Math.round(
            matches.reduce((sum, item) => sum + item.matchScore, 0) /
              matches.length,
          );

    const chartData = [
      {
        name: "Resume Analyses",
        score: totalResumes,
      },
      {
        name: "Job Matches",
        score: totalMatches,
      },
      {
        name: "Avg Match Score",
        score: averageMatchScore,
      },
    ];

    const totalCoverLetters = await prisma.resumeAnalysis.count({
      where: {
        userId: req.user.userId,
        coverLetter: {
          not: null,
        },
      },
    });

    const recentResumeScores = await prisma.resumeAnalysis.findMany({
      where: {
        userId: req.user.userId,
        resumeScore: {
          not: null,
        },
      },

      orderBy: {
        createdAt: "asc",
      },

      take: 7,

      select: {
        resumeScore: true,
        createdAt: true,
      },
    });

    const resumeScoreData = recentResumeScores.map((item, index) => ({
      name: `Resume ${index + 1}`,
      score: item.resumeScore,
    }));

    const recentMatches = await prisma.jobMatch.findMany({
      where: {
        userId: req.user.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      select: {
        matchScore: true,
        createdAt: true,
      },
    });

    const matchScoreData = recentMatches.reverse().map((match, index) => ({
      name: `Match ${index + 1}`,
      score: match.matchScore,
    }));

    const analyses = await prisma.resumeAnalysis.findMany({
      where: {
        userId: req.user.userId,
      },

      select: {
        skills: true,
        missingSkills: true,
        resumeScore: true,
      },
    });

    const bestResumeScore = Math.max(
      ...analyses.map((item) => item.resumeScore || 0),
      0,
    );

    const allMissingSkills = analyses.flatMap(
      (item) => item.missingSkills || [],
    );

    const skillCounts = {};

    allMissingSkills.forEach((skill) => {
      skillCounts[skill] = (skillCounts[skill] || 0) + 1;
    });

    const mostCommonMissingSkill = Object.keys(skillCounts).reduce(
      (a, b) => (skillCounts[a] > skillCounts[b] ? a : b),
      "",
    );

    const insightSummary = `
Your resume performance is improving.
Focus more on ${mostCommonMissingSkill || "technical skills"}
to improve your match scores further.
Your best resume score is ${bestResumeScore}%.
`;

    res.json({
      totalResumes,
      totalMatches,
      totalCoverLetters,
      averageMatchScore,
      chartData,
      matchScoreData,
      resumeScoreData,
      bestResumeScore,
      mostCommonMissingSkill,
      insightSummary,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch dashboard stats",
    });
  }
});

module.exports = router;
