require('dotenv').config()

const express = require('express')
const cors = require('cors')

const authRoutes = require('./routes/authRoutes')
const resumeRoutes = require('./routes/resumeRoutes')
const jobMatchRoutes = require('./routes/jobMatchRoutes')
const dashboardRoutes = require('./routes/dashboardRoutes')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/', authRoutes)
app.use('/', resumeRoutes)
app.use('/', jobMatchRoutes)
app.use('/', dashboardRoutes)

app.get('/', (req, res) => {
  res.send('Backend is running')
})

app.listen(5000, () => {
  console.log('Server running on port 5000')
})