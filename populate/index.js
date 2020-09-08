const config = require('../config/dev')
const mongoose = require('mongoose')
const fakeDB = require('./FakeDB')

// Running 'npm run populate' in terminal will run this file which will delete
// all data (both Portfolios and Blogs) from the server and import the dummy data
// from FakeDB.js (in the same folder)
mongoose.connect(
  config.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
}, async (err) => {
  if (err) console.error(err)
  else {
    console.log('> Starting to populate DB...')
    await fakeDB.populate()
    await mongoose.connection.close()
    console.log('> DB populated')
  }
})
