const express = require('express')
const multer = require('multer')
const fs = require('fs')
const { PDFParse } = require('pdf-parse')
const prisma = require('../prismaClient')

const router = express.Router()

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },

  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname
    cb(null, uniqueName)
  },
})

const upload = multer({ storage })

router.post(
  '/upload-resume',
  upload.single('resume'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: 'No file uploaded',
        })
      }

      const fileBuffer = fs.readFileSync(req.file.path)

      const parser = new PDFParse({
        data: fileBuffer,
      })

      const pdfData = await parser.getText()

      res.json({
        message: 'Resume uploaded and parsed successfully',
        fileName: req.file.filename,
        resumeText: pdfData.text,
      })
    } catch (error) {
      console.error(error)

      res.status(500).json({
        message: 'Failed to parse resume',
      })
    }
  }
)

router.post('/analyze-resume', async (req, res) => {
  try {
    const { resumeText, fileName } = req.body

    const analysis = {
      summary:
        'Experienced full-stack developer with strong backend and web development experience.',

      skills: [
        'PHP',
        'Laravel',
        'Vue.js',
        'Node.js',
        'Python',
      ],

      missingSkills: [
        'React',
        'TypeScript',
        'Docker',
      ],

      suggestions: [
        'Add measurable achievements',
        'Show more React projects',
      ],

      jobRoles: [
        'Full Stack Developer',
        'Software Engineer',
      ],
    }

    const savedAnalysis =
      await prisma.resumeAnalysis.create({
        data: {
          fileName,
          resumeText,
          summary: analysis.summary,
          skills: analysis.skills,
          missingSkills: analysis.missingSkills,
          suggestions: analysis.suggestions,
          jobRoles: analysis.jobRoles,
        },
      })

    res.json({
      message: 'Resume analyzed successfully',
      analysis,
      savedAnalysisId: savedAnalysis.id,
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Analysis failed',
    })
  }
})

router.get('/resume-analyses', async (req, res) => {
  try {
    const data =
      await prisma.resumeAnalysis.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      })

    res.json(data)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to fetch analyses',
    })
  }
})

module.exports = router