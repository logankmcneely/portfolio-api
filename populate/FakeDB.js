const Portfolio = require('../db/models/portfolio')
const Blog = require('../db/models/blog')
const { portfolios, blogs } = require('./data')

// Class used to delete and add dummy data to the server for testing purposes
class FakeDB {

  async clean() {
    await Portfolio.deleteMany({})
    await Blog.deleteMany({})
  }

  async addData() {
    await Portfolio.create(portfolios)
    await Blog.create(blogs)
  }

  async populate() {
    await this.clean()
    await this.addData()
  }
}

module.exports = new FakeDB()
