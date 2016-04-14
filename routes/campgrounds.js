var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');


// middleware
var isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect('/login');
    }
};

// INDEX - shows all campgrounds
router.get('/', function(req, res) {
    Campground.find({}, function(err, campgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render('campgrounds/index', { campgrounds: campgrounds, currentUser: req.user });
        }
    });
});




// To post a campground
router.post('/', isLoggedIn, function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = { name: name, image: image, description: description, author: author };
    // Create new campground ans save to DB
    Campground.create(newCampground, function(err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/campgrounds');
        }
    });
});


// NEW - show form to create new campground form
router.get('/new', isLoggedIn , function(req, res) {
    res.render('campgrounds/new');
});



// SHOW - shows more info about one campground
router.get('/:id', isLoggedIn, function(req, res) {
    Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            console.log(foundCampground);
            res.render('campgrounds/show', { campground: foundCampground });
        }
    });
});


module.exports = router;