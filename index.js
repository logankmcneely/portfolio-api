const express = require('express')
const server = express()
const bodyParser = require('body-parser')

async function runServer() {

  // Connect DB
  await require('./db').connect()

  server.use(bodyParser.json())

  // Create Routes
  const portfoliosRoutes = require('./routes/portfolios')
  server.use('/api/v1/portfolios', portfoliosRoutes)

  // Initialize server
  const PORT = process.env.PORT || 3001
  server.listen(PORT, (err) => {
    if (err) console.error(err)
    console.log('> Server ready on port:', PORT)
  })

}

runServer()
