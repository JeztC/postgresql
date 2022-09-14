const router = require('express').Router()

const { User, Blog} = require('../models')

const isAdmin = async (req, res, next) => {
    const user = await User.findByPk(req.decodedToken.id)
    if (!user.admin) {
        return res.status(401).json({ error: 'operation not allowed' })
    }
    next()
}

router.get('/', async (req, res) => {
    const users = await User.findAll({
        include: {
            model: Blog,
            attributes: { exclude: ['userId'] }
        }
    })
    res.json(users)
})

router.post('/', async (req, res) => {
    try {
        const date = new Date()
        const user = await User.create({...req.body, createdAt : date, updatedAt : date})
        res.json(user)
    } catch(error) {
        return res.status(400).json({ error })
    }
})

router.put('/:username', isAdmin, async (req, res) => {
    const user = await User.findOne({
        where: {
            username: req.params.username
        }
    })

    if (user) {
        user.disabled = req.body.disabled
        await user.save()
        res.json(user)
    } else {
        res.status(404).end()
    }
})

router.get('/:id', async (req, res) => {
    const where = {}
    if (req.query.read) {
        where.read = req.query.read === "true"
    }
    const user = await User.findByPk(req.params.id, {
        attributes: { exclude: ['id', 'createdAt', 'updatedAt', 'admin', 'disabled'] } ,
        include:[
            {
                model: Blog,
                as: 'readings',
                attributes: { exclude: ['userId'] } ,
                through: {
                    attributes: { exclude: ['blogId', 'userId'] },
                    where
                },
            },
        ]
    })
    if (user) {
        res.json(user)
    } else {
        res.status(404).end()
    }
})

module.exports = router