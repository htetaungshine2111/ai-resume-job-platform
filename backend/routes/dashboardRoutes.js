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

    res.json({
      totalResumes,
      totalMatches,
      totalCoverLetters,
      averageMatchScore,
      chartData,
      matchScoreData,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch dashboard stats",
    });
  }
});

module.exports = router;
