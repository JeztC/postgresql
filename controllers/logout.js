const User = require("../models/user");
const TokenSession = require("../models/tokensession");
const router = require('express').Router();

router.delete('/', async (req, res) => {
    const user = await User.findByPk(req.decodedToken.id)
    const verifyToken = await TokenSession.findOne({
        where: {
            userId: user.id
        }
    })
    if (verifyToken) {
        await verifyToken.destroy()
    }
})

module.exports = router