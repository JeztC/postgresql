const ReadingList = require("../models/readinglist");
const {User} = require("../models");
const {tokenExtractor} = require("../util/middleware");
const router = require('express').Router()

router.get('/', async (req, res) => {
    const readingLists = await ReadingList.findAll({
        attributes: { exclude: ['id'] },
    })
    res.json(readingLists)
})

router.put('/:id', tokenExtractor, async (req, res) => {
    const user = await User.findByPk(req.decodedToken.id)
    const read = req.body.read
    const id = req.params.id

    const readingList = await ReadingList.findOne({
        where: {
            id
        }
    })
    if (readingList) {
        if (readingList.userId === user.id) {
            readingList.read = read
            await readingList.save()
            res.json(readingList)
        }
    } else {
        res.status(404).end()
    }
})


module.exports = router