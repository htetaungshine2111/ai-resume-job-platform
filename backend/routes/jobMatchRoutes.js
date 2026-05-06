const express = require('express')
const prisma = require('../prismaClient')

const router = express.Router()

router.post('/job-match', async (req, res) => {
  try {
    const { resumeText, jobDescription } =
      req.body

    const requiredSkills = [
      'javascript',
      'typescript',
      'react',
      'vue',
      'node.js',
      'python',
      'php',
      'laravel',
      'postgresql',
      'docker',
      'aws',
    ]

    const resumeLower = resumeText.toLowerCase()
    const jobLower =
      jobDescription.toLowerCase()

    const jobRequiredSkills =
      requiredSkills.filter((skill) =>
        jobLower.includes(skill)
      )

    const matchedSkills =
      jobRequiredSkills.filter((skill) =>
        resumeLower.includes(skill)
      )

    const missingSkills =
      jobRequiredSkills.filter(
        (skill) =>
          !resumeLower.includes(skill)
      )

    const matchScore =
      jobRequiredSkills.length === 0
        ? 0
        : Math.round(
            (matchedSkills.length /
              jobRequiredSkills.length) *
              100
          )

    const suggestions =
      missingSkills.map(
        (skill) =>
          `Add or improve experience with ${skill}`
      )

    const result = {
      matchScore,
      summary: `Resume matches ${matchedSkills.length} of ${jobRequiredSkills.length} detected skills.`,
      matchedSkills,
      missingSkills,
      suggestions,
    }

    const savedMatch =
      await prisma.jobMatch.create({
        data: {
          resumeText,
          jobDescription,
          matchScore: result.matchScore,
          matchedSkills:
            result.matchedSkills,
          missingSkills:
            result.missingSkills,
          suggestions: result.suggestions,
        },
      })

    res.json({
      message:
        'Job match completed successfully',
      result,
      savedId: savedMatch.id,
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Job match failed',
    })
  }
})

router.get('/job-matches', async (req, res) => {
  try {
    const matches =
      await prisma.jobMatch.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      })

    res.json(matches)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message:
        'Failed to fetch job matches',
    })
  }
})



router.delete('/job-matches/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)

    await prisma.jobMatch.delete({
      where: { id },
    })

    res.json({ message: 'Job match deleted successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to delete job match' })
  }
})

module.exports = router