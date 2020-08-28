const jwt = require('express-jwt')
const jwksRsa = require('jwks-rsa')

// Authentication middleware
// Checks access token in auth headers of a req

exports.checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 10,
    jwksUri: 'https://lmcneely.us.auth0.com/.well-known/jwks.json'
  }),
  audience: 'https://lmcneely.us.auth0.com/api/v2/',
  issuer: 'https://lmcneely.us.auth0.com/',
  algorithms: ['RS256']
})
