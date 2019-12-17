//Create an express router object
let router = require('express').Router()

//includ a reference to the models for db access
let db = require('../models')

//Define routes
router.get('/login', (req, res) => {
    res.render('auth/login')
})

router.post('/login', (req, res) => {
    res.send(req.body)
})

router.get('/signup', (req, res) => {
    res.render('auth/signup', { data: {} })
})

router.post('/signup', (req, res) => {
    if (req.body.password !== req.body.verify_password) {
        //User's password verfication doesnt match - probably a typo
        req.flash('error', 'Passwords do not match!')
        res.render('auth/signup', { data: req.body, alerts: req.flash() })
    } else {
        //Attempt to find a user by their email. if not found, then create them
        db.user.findOrCreate({
            where: { email: req.body.email },
            defaults: req.body
        })
        .then(([user, wasCreated]) => {
            if (wasCreated) {
                //This is the intended user action (they did things correctly)
                //Now i want to automatically of in the user to their new acct
                //TODO: log in the user
                res.send('Successful Create user - go look at db')
            }
            else {
                //The user already has an account 
                req.flash('error', 'Account already exists. Go log in!')
                res.redirect('/auth/login')
            }
        })
        .catch(err => {
            //Print out a general error to the terminal
            console.log('Error when creating a user', err)

            //Check for validaton errors (okay for users to see)
            if (err.errors) {
                err.errors.forEach(e => {
                    if (e.type === 'Validation error') {
                        req.flash('error', e.message)
                    }
                })
            }
            else {
                //General error for any other issue
                req.flash('error', 'Something happened???')
            }

            res.redirect('/auth/signup')
        })
    }
})

router.get('/logout', (req, res) => {
    res.send('GET /auth/logout')
})

//Export router object so we can include it in other files
module.exports = router