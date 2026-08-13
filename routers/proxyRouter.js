const router = require('express').Router(),
    User = require('../schemas/userSchema')

router.get('/', (req, res) => {
    res.render('proxy')
})

router.post('/', async (req, res) => {
    try {
        const {proxy} = req.body
        if (!proxy) return res.end('Proxy not provided!')
        await User.updateOne({email: req.user.email}, {
            $set: {
                proxy: proxy
            }
        })
        res.redirect('/')
    } catch (error) {
        res.end('There was an error. Please try again.')
    }
})

module.exports = router