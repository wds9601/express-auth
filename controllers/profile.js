let router = require('express').Router()
let isAdminLoggedIn = require('../middleware/isAdminLoggedIn')
let isLoggedIn = require('../middleware/isLoggedIn')

router.get('/', isLoggedIn, (req, res) => {
    res.render('profile/main')
})

router.get('/admin', isAdminLoggedIn, (req, res) => {
    res.render('profile/admin')
})

module.exports = router