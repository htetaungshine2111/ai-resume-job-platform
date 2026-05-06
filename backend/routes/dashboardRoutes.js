const express = require('express')
const prisma = require('../prismaClient')

const router = express.Router()

router.get('/dashboard-stats', async (req, res) => {
  try {
    const totalResumes =
      await prisma.resumeAnalysis.count()

    const totalMatches =
      await prisma.jobMatch.count()

    const matches =
      await prisma.jobMatch.findMany()

    const averageMatchScore =
      matches.length === 0
        ? 0
        : Math.round(
            matches.reduce(
              (sum, item) =>
                sum + item.matchScore,
              0
            ) / matches.length
          )

    const chartData = [
      {
        name: 'Resume Analyses',
        score: totalResumes,
      },
      {
        name: 'Job Matches',
        score: totalMatches,
      },
      {
        name: 'Avg Match Score',
        score: averageMatchScore,
      },
    ]

    res.json({
      totalResumes,
      totalMatches,
      averageMatchScore,
      chartData,
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message:
        'Failed to fetch dashboard stats',
    })
  }
})

module.exports = router