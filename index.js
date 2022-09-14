const express = require('express')
const app = express()

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')

const authorsRouter = require('./controllers/authors')
const readingListsRouter = require('./controllers/readinglists')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const {Blog, User} = require("./models");
const {tokenExtractor} = require("./util/middleware");

app.use(express.json())

const blogFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id)
    next()
}

const userFinder = async (req, res, next) => {
    req.user = await User.findOne(req.params.username)
    next()
}

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({error: error.message})
    }

    next(error)
}

app.use(errorHandler)
app.use(tokenExtractor)

app.use('/api/logout', readingListsRouter)
app.use('/api/readinglists', readingListsRouter)
app.use('/api/authors', authorsRouter)
app.use('/api/blogs', blogsRouter, blogFinder)
app.use('/api/users', usersRouter, userFinder)
app.use('/api/login', loginRouter)

const start = async () => {
    await connectToDatabase()
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
}

start()