const express = require('express')
const server = express()
const config = require('./config/dev')

const mongoose = require('mongoose')
mongoose.connect(config.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}, (err) => {
  if (err) console.log(err)
  else console.log('> Connected to DB')
})

const portfoliosRoutes = require('./routes/portfolios')

server.get('/test', (req, res) => {
  return res.json({ message: 'test is working' })
})

server.use('/api/v1/portfolios', portfoliosRoutes)

const PORT = process.env.PORT || 3001
server.listen(PORT, (err) => {
  if (err) console.error(err)
  console.log('> Server ready on port:', PORT)
})
