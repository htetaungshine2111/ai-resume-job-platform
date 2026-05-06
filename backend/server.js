require('dotenv').config()

const express = require('express')
const cors = require('cors')
const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({ adapter })
const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')
const multer = require('multer')
const path = require('path')

const app = express()

const fs = require('fs')
const { PDFParse } = require('pdf-parse')

const OpenAI = require('openai')

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})


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


app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Backend is running')
})

app.listen(5000, () => {
  console.log('Server running on port 5000')
})


app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return res.status(400).json({ message: 'User not found' })
    }

    const isValid = await bcrypt.compare(password, user.password)

    if (!isValid) {
      return res.status(400).json({ message: 'Invalid password' })
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d',
      }
    )

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Login failed' })
  }
})


app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body

    // check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return res.status(400).json({
        message: 'Email already registered',
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    res.json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Registration failed',
    })
  }
})


app.post('/upload-resume', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }

    const fileBuffer = fs.readFileSync(req.file.path)
    const parser = new PDFParse({ data: fileBuffer })
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
})


app.post('/analyze-resume', async (req, res) => {
  try {
    const { resumeText, fileName } = req.body

    if (!resumeText) {
      return res.status(400).json({ message: 'Resume text is required' })
    }

    const analysis = {
      summary:
        'Experienced full-stack developer with strong background in PHP, Laravel, Vue.js, and backend systems.',

      skills: [
        'PHP',
        'Laravel',
        'Vue.js',
        'Python',
        'Node.js',
        'API Development',
      ],

      missingSkills: [
        'React',
        'TypeScript',
        'PostgreSQL',
        'Docker',
        'AWS',
      ],

      suggestions: [
        'Add measurable achievements',
        'Include project links',
        'Highlight full-stack experience',
        'Showcase AI projects',
      ],

      jobRoles: [
        'Full Stack Developer',
        'Backend Developer',
        'Software Engineer',
      ],
    }

    const savedAnalysis = await prisma.resumeAnalysis.create({
      data: {
        fileName: fileName || 'resume.pdf',
        resumeText,
        summary: analysis.summary,
        skills: analysis.skills,
        missingSkills: analysis.missingSkills,
        suggestions: analysis.suggestions,
        jobRoles: analysis.jobRoles,
      },
    })

    res.json({
      message: 'Resume analyzed and saved successfully',
      analysis,
      savedAnalysisId: savedAnalysis.id,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Analysis failed' })
  }
})


app.get('/resume-analyses', async (req, res) => {
  try {
    const data = await prisma.resumeAnalysis.findMany({
      orderBy: { createdAt: 'desc' },
    })

    res.json(data)
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Failed to fetch analyses' })
  }
})


app.post('/job-match', async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body

    if (!resumeText || !jobDescription) {
      return res.status(400).json({
        message: 'Resume text and job description are required',
      })
    }

    const result = {
      matchScore: 78,
      summary:
        'The resume is a good match for a full stack developer role, especially for backend and web development work.',
      matchedSkills: ['PHP', 'Laravel', 'Vue.js', 'Node.js', 'API Development'],
      missingSkills: ['React', 'TypeScript', 'AWS', 'Docker'],
      suggestions: [
        'Add React and TypeScript project experience',
        'Highlight API development more strongly',
        'Add cloud deployment experience',
        'Include measurable achievements in resume bullets',
      ],
    }

    res.json({
      message: 'Job match completed successfully',
      result,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Job match failed' })
  }
})