const router = require('express').Router()
const User = require('../schemas/userSchema')
const bcrypt = require('bcrypt')

router.get('/', (req, res) => {
    res.render('register', {error: false})
})

router.post('/', async (req, res) => {
     const {email, password, name, cnfpassword, teamName} = req.body
     const foundUser = await User.findOne({email})
     const foundUser2 = await User.findOne({name})
     if (!email || !password || !name || !cnfpassword || !teamName) {
        return res.render('register', {error: "Please enter all the credentials."})
     }
     if (password != cnfpassword) {
        return res.render('register', {error: "The passwords do not match!"})
     }
     if (foundUser) {
        return res.render('register', {error: "A user with this email already exists. Please login instead."})
     }
     if (foundUser2) {
        return res.render('register', {error: "A user with this display name already exists. Please login instead."})
     }
     const newUser = new User({
        email: email,
        name: name,
        password: await bcrypt.hash(password, 10),
        teamName: teamName
     })
     await newUser.save()
     res.redirect('/login')
})

module.exports = router