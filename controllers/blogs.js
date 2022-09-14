const router = require('express').Router()

const { Blog, User} = require('../models')
const {Op} = require("sequelize");
const {sequelize} = require("../util/db");
const TokenSession = require("../models/tokensession");

router.get('/', async (req, res) => {
    let where = {}
    if (req.query.search) {
        where = {
            [Op.or]: [{ title: req.query.search }, { author: req.query.search }],
        }
    }
    const blogs = await Blog.findAll({
        attributes: { exclude: ['userId'] },
        include: {
            model: User,
            attributes: ['name']
        },
        where,
        order: sequelize.literal('likes DESC'),
    })
    res.json(blogs)
})

router.get('/:id', (req, res, next) => {
    req.blog.then(blog => {
        if (blog) {
            res.json(blog)
        } else {
            res.status(404).end()
        }
    }).catch(error => next(error))
})

router.put('/:id', async (req, res, next) => {
    req.blog.then(async blog => {
        const user = await User.findByPk(req.decodedToken.id)
        const verifyToken = await TokenSession.findOne({
            where: {
                userId: user.id
            }
        })
        if (verifyToken) {
            if (blog) {
                req.blog.likes = req.body.likes + 1
                await req.blog.save()
                res.json(req.blog)
            } else {
                res.status(404).end()
            }
        } else {
            res.status(404).end()
        }
    }).catch(error => next(error))
})

router.post('/', async (req, res) => {
    try {
        const user = await User.findByPk(req.decodedToken.id)
        const verifyToken = await TokenSession.findOne({
            where: {
                userId: user.id
            }
        })
        if (verifyToken) {
            const blog = await Blog.create({...req.body, userId: user.id});
            return res.json(blog)
        } else {
            res.status(404).end()
        }
    } catch(error) {
        return res.status(400).json({ error })
    }
})

router.delete('/:id', async (req, res, next) => {
    req.blog.then(async blog => {
        const user = await User.findByPk(req.decodedToken.id)
        const verifyToken = await TokenSession.findOne({
            where: {
                userId: user.id
            }
        })
        if (verifyToken) {
            if (blog) {
                if (blog.userId === user.id) {
                    await req.blog.destroy()
                    res.status(204).end()
                } else {
                    res.status(404).end()
                }
            }
        } else {
            res.status(404).end()
        }
    }).catch(error => next(error))
})

module.exports = router