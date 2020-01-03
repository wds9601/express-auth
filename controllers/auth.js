//Create an express router object
let router = require('express').Router()

//includ a reference to the models for db access
let db = require('../models')

//refernce to passport module
let passport = require('../config/passportConfig')

//Define routes
router.get('/login', (req, res) => {
    res.render('auth/login')
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/profile',
    successFlash: 'Yay, we logged in!',
    failureRedirect: '/auth/login',
    failureFlash: 'Invalid Credentials :('
    
}))

router.get('/signup', (req, res) => {
    res.render('auth/signup', { data: {} })
})

router.post('/signup', (req, res, next) => {
    if (req.body.password !== req.body.verify_password) {
        //User's password verfication doesnt match - probably a typo
        req.flash('error', 'Passwords do not match!')
        res.render('auth/signup', { data: req.body, alerts: req.flash() })
    }
    else {
        //Attempt to find a user by their email. if not found, then create them
        db.user.findOrCreate({
            where: { email: req.body.email },
            defaults: req.body
        })
        .then(([user, wasCreated]) => {
            if (wasCreated) {
                //This is the intended user action (they did things correctly)
                //Now i want to automatically of in the user to their new acct
                passport.authenticate('local', {
                    successRedirect: '/profile',
                    successFlash: 'Yay, successful account creation!',
                    failureRedirect: '/auth/login',
                    failureFlash: 'This shouldnt happen'
                })(req, res, next)
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
    req.logout() //throws away session data of logged in user
    req.flash('success', 'Goodbye, see you next time!')
    res.redirect('/')
})

//GitHub login routes
//this is route that our app uses
router.get('/github', passport.authenticate('github'))

//this is the route Github uses
router.get('/callback/github', passport.authenticate('github', {
    successRedirect: '/profile',
    successFlash: 'Github login success',
    failureRedirect: '/auth/login',
    failureFlash: 'Github does not like it'
}))

//Facebook login routes
//this is the route our app uses
router.get('/facebook', passport.authenticate('facebook', {
    scope: ['public_profile', 'email', 'birthday']
}))

//the route FB uses
router.get('/callback/facebook', passport.authenticate('facebook', {
    successRedirect: '/profile',
    successFlash: 'Facebook login success',
    failureRedirect: '/auth/login',
    failureFlash: 'Facebook does not like it'
}))

//Export router object so we can include it in other files
module.exports = router