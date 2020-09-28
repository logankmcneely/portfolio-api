const express = require('express')
const server = express()
const bodyParser = require('body-parser')

async function runServer() {

  // Connect DB
  await require('./db').connect()

  server.use(bodyParser.json())

  // Create Routes
  server.use('/api/v1/portfolios', require('./routes/portfolios'))
  server.use('/api/v1/blogs', require('./routes/blogs'))

  server.get('', (req, res) => {
    res.sendFile('index.html', {root: __dirname})
  })

  // Initialize server
  const PORT = process.env.PORT || 3001
  server.listen(PORT, (err) => {
    if (err) console.error(err)
    console.log('> Server ready on port:', PORT)
  })
}

runServer()
