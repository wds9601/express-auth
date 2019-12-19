module.exports = (req, res, next) => {
    //Someone is logged in; AND they are admin - let them through
    if (req.user && req.user.admin) {
        //someone is logged in, let them through
        next()
    }
    else {
        //no one is logged in, or they dont belong. this is bad. redirect them away from what should be a protcted page
        req.flash('error', 'You must be an ADMIN to view this page')
        res.redirect('/auth/login')
    }
} 