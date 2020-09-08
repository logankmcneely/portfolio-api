const mongoose = require('mongoose')
const Blog = mongoose.model('Blog')
const slugify = require('slugify')
const uniqueSlug = require('unique-slug')
const { getAccessToken, getAuth0User } = require('./auth')

// Get all blogs from server and attach author to them from userId
exports.getBlogs = async (req, res) => {
  const blogs = await Blog.find({ status: 'published' }).sort({ createdAt: -1 })
  const { access_token } = await getAccessToken()
  const blogsWithAuthor = []
  const authors = {}

  for (let blog of blogs) {
    const author = authors[blog.userId] || await getAuth0User(access_token)(blog.userId)
    authors[author.user_id] = author
    blogsWithAuthor.push({blog, author})
  }
  return res.json(blogsWithAuthor)
}

// Get individual blog from server by its ID
exports.getBlogById = async (req, res) => {
  const blog = await Blog.findById(req.params.id)
  return res.json(blog)
}

// Get individual blog form server from its Slug
exports.getBlogBySlug = async (req, res) => {
  const blog = await Blog.findOne({ slug: req.params.slug })
  const { access_token } = await getAccessToken()
  const author = await getAuth0User(access_token)(blog.userId)
  return res.json({blog, author})
}

// Get all blogs from server from user of status 'draft' or 'published' ('deleted' not returned)
exports.getBlogsByUser = async (req, res) => {
  const userId = req.user.sub
  const blogs = await Blog.find({ 
    userId,
    status: { $in: ['draft', 'published'] }
  })
  return res.json(blogs)
}

// Add blog to server or return error
exports.createBlog = async (req, res) => {
  const blogData = req.body
  blogData.userId = req.user.sub
  const blog = new Blog(blogData)

  try {
    const createdBlog = await blog.save()
    return res.json(createdBlog)
  } catch (e) {
    return res.status(422).send(e.message)
  }
}

// Before saving a published blog to server, create a unique slug to attach to it
const _publishBlogWithUniqueSlug = async blog => {
  try {
    const createdBlog = await blog.save()
    return createdBlog
  } catch(e) {
    if (e.code === 11000 && e.keyPattern && e.keyPattern.slug) {
      blog.slug += `-${uniqueSlug()}`
      return _publishBlogWithUniqueSlug(blog)
    }
    throw(e)
  }
}

// Update a blog and if it is to be published, make sure it has a unique slug
exports.updateBlog = async (req, res) => {
  const { body, params: { id } } = req

  Blog.findById(id, async (e, blog) => {

    if (e) {
      return res.status(422).send(e.message)
    }

    if (body.status && body.status === 'published' && !blog.slug) {
      blog.slug = slugify(blog.title, {
        lower: true,
      })
    }

    blog.set(body)
    blog.updatedAt = new Date()

    try {
      const updatedBlog = await _publishBlogWithUniqueSlug(blog)
      return res.json(updatedBlog)
    } catch (e) {
      return res.status(422).send(e.message)
    }
  })
}
