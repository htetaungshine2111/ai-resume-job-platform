const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Backend is running')
})

app.listen(5000, () => {
  console.log('Server running on port 5000')
})


app.post('/login', (req, res) => {
  const { email, password } = req.body

  console.log(email, password)

  res.json({
    message: 'Login successful (mock)',
    user: { email }
  })
})


app.post('/register', (req, res) => {
  const { name, email, password } = req.body

  console.log('New user:', name, email, password)

  res.json({
    message: 'Register successful (mock)',
    user: {
      name,
      email
    }
  })
})