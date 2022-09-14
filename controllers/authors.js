const {Blog} = require("../models");
const {sequelize} = require("../util/db");
const router = require('express').Router()

router.get('/', async (req, res) => {
    const authors = await Blog.findAll({
        group: 'author',
        attributes: [
            'author',
            [sequelize.fn('COUNT', sequelize.col('title')), 'articles'],
            [sequelize.fn('COUNT', sequelize.col('likes')), 'likes'],
        ]
    });
    res.json(authors)
})


module.exports = router