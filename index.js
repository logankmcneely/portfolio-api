const express = require('express')
const server = express()

async function runServer() {

  // Connect DB
  await require('./db').connect()

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
