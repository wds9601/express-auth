module.exports = (req, res, next) => {
    if (req.user) {
        //someone is logged in, let them through
        next()
    }
    else {
        //no one is logged in, this is bad. redirect them away from what should be a protcted page
        req.flash('error', 'You must be logged in to view this page')
        res.redirect('/auth/login')

    }
} 