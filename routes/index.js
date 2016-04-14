var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

// Check if logged in middleware
var isLoggedIn = function(req, res, next){
    if(req.isAuthenticated){
        return next();
    } else {
        res.redirect('/login');
    }
};


// Root route
router.get('/', function(req, res) {
    res.render('landing');
});

//Show register form
router.get('/register', function(req, res){
    res.render('register');
});


// Handle signup logic route
router.post('/register', function(req, res){
    var newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('register');
        } else {
            passport.authenticate('local')(req, res, function(){ // makes a call to line 38
                res.redirect('/campgrounds');
            })
        }

    });
});

// Show login form
router.get('/login', function(re, res){
    res.render('login');
});


// Handle Login Logic
router.post('/login', passport.authenticate('local',
    {
        successRedirect: '/campgrounds',
        failureRedirect: '/login'
    }), function(req, res){
});


// Logout route
router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/campgrounds');
});

module.exports = router;