//require passport and any passport strategies you wish to use
let passport = require('passport')
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

//make sure you can include this file in other files
module.exports = passport