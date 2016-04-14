var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');


// middleware
var isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login');
    }
};

var checkCampgroundOwnership = function(req, res, next) {
    // Is user logged in?
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCampground) {
            if (err) {
                res.redirect('back');
            } else {
                // Does user own campground?
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect('back');
                }
            }
        });
    } else {
        res.redirect('back');
    }
}

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
router.get('/new', isLoggedIn, function(req, res) {
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


// EDIT CAMPGROUND ROUTE
router.get('/:id/edit', checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        res.render('campgrounds/edit', { campground: foundCampground });
    });
});

// UPDATE CAMPGROUND ROUTE
router.put('/:id', checkCampgroundOwnership, function(req, res) {
    // I can do req.body.campground because I wrapped everything up in the name form
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
        res.redirect('/campgrounds/' + req.params.id);
    });
});



// DESTROY CAMPGROUND ROUTE
router.delete('/:id', checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        res.redirect('/campgrounds');
    });
});

module.exports = router;
