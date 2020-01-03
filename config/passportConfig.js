//READ ENV files
require('dotenv').config()

//require passport and any passport strategies you wish to use
let passport = require('passport')
let FacebookStrategy = require('passport-facebook').Strategy
let GithubStrategy = require('passport-github2').Strategy
let LocalStrategy = require('passport-local').Strategy

//Reference the models folder to access the db
let db = require('../models')

//Serialization and DeSerialization functions
//These are for passport to use tostore/lookup info
//Serialize: Reduce the user to only their unique ID
passport.serializeUser((user, cb) => {
    //callback function params: error message (null if no error); user data (only the id)
    cb(null, user.id) //grabbing user, chopping off all data excpeet for ID
})

//Deserialization: Takes a user ID and looks up the rest of the info
passport.deserializeUser((id, cb) => {
    db.user.findByPk(id)
    .then(user => {
        //callback(errorMessage and userData)
        cb(null, user)
    })
    .catch(cb)
})

//Implement the Local Strategy (local database)
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, (email, password, cb) => {
    //try looking up the user by their email
    db.user.findOne({
        where: { email: email }
    })
    .then(foundUser => {
        //check if i found a user, then check their password
        if (!foundUser || !foundUser.validPassword(password)) {
            //uh-oh, bad user or maybe typo on password
            cb(null, null)
        }
        else {
            //Valid user and valid password
            cb(null, foundUser)
        }
    })
    .catch(cb)
}))

//Implement Github Strategy
passport.use(new GithubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_SECRET,
    callbackURL: process.env.BASE_URL + '/auth/callback/github'
}, (accessToken, refreshToken, profile, cb) => {
    console.log('Github Login', profile)
    let name = profile.displayName ? profile.displayName.split(' ') : profile.username
    db.user.findOrCreate({
        where: { githubId: profile.id },
        defaults: {
            githubToken: accessToken,
            firstname: name[0] || profile.username,
            lastname: name[name.length - 1],
            username: profile.username,
            photoUrl: profile._json.avatar_url,
            bio: profile._json.bio || `Github user ${profile.username} works at ${profile._json.company} in ${profile._json.location}`
        }
    })
    .then(([user, wasCreated]) => {
        //FInd out if user was already a GH user.  If so, they need a new token probably
        if (!wasCreated && user.githubId) {
            user.update({
                githubToken: accessToken
            })
            .then(updatedUser => {
                cb(null, updatedUser)
            })
            .catch(cb)
        } else {
        //newly created user or , not a previous GH user
        return cb(null, user)
        }
    })
    .catch(cb)
}))

//Implement Facebook Strategy //I DID NOT CREATE THE NECESSARY FB APP ON THEIR DEV PAGE, IS NOT WORKING CORRECTLY
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.BASE_URL + '/auth/callback/facebook',
    profileFields: ['id', 'email', 'display name', 'photos', 'birthday']
}, (accessToken, refreshToken, profile, cb) => {
    console.log('Facebook login', profile)
    //Grab the facebook primary email
    let facebookEmail = profile.emails[0].value
    let displayName = profile.displayName.split(' ')
    let photo = profile.photos.length ? profile.photos[0].value : 'http://place-puppy.com/200x200'

    //look for email in local database - DO NOT DUPLICATE!
    db.user.findOrCreate({
        where: { email: facebookEmail },
        defaults: {
            facebookToken: accessToken,
            facebookId: profile.id,
            firstname: displayName[0],
            lastname: displayName[displayName.length - 1],
            username: profile.username || displayName[0],
            photoUrl: photo,
            birthdate: profile._json.birthday,
            bio: `${profile.displayName} created this account with Facebook!`
        }
    })
    .then(([user, wasCreated]) => {
        //Did we find a new user? 
        if (wasCreated || user.facebookId) {
            //new user, not found in local database
            cb(null, user)
        } else {
            //we found an existing user (add facebook ID and Token)
            user.update({
                facebookId: profile.id,
                facebookToken: accessToken
            })
            .then(updatedUser => {
                cb(null, updatedUser)
            })
            .catch(cb)
        }
    })
    .catch(cb)
}))

//make sure you can include this file in other files
module.exports = passport