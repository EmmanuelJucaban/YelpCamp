var PORT              = process.env.PORT || 3000,
    express           = require('express'),
    bodyParser        = require('body-parser'),
    mongoose          = require('mongoose'),
    passport          = require('passport'),
    LocalStrategy     = require('passport-local'),
    Campground        = require('./models/campground'),
    Comment           = require('./models/comment'),
    User              = require('./models/user'),
    seedDB            = require('./seed')


seedDB();

mongoose.connect('mongodb://localhost/yelpcamp');
var app = express();


// Landing page
app.get('/', function(req, res) {
    res.render('landing');
});


// Set up body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
// Sets the view engine to ejs
app.set('view engine', 'ejs');



// Campground link
app.get('/campgrounds', function(req, res) {
    Campground.find({}, function(err, campgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render('campgrounds/index', { campgrounds: campgrounds });
        }
    });
});



// Show add campground form
app.get('/campgrounds/new', function(req, res) {
    res.render('new');
});



// To post a campground
app.post('/campgrounds', function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampground = { name: name, image: image, description: description };
    Campground.create(newCampground, function(err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('campgrounds');
        }
    });
});



// SHOW - shows more info about one campground
app.get('/campgrounds/:id', function(req, res) {
    Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            console.log(foundCampground);
            res.render('campgrounds/show', { campground: foundCampground });
        }
    });
});



// ================================
// Comment routes
// ================================ 
app.get('/campgrounds/:id/comments/new', function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render('comments/new', { campground: campground });
        }
    });
});

app.post('/campgrounds/:id/comments', function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
            res.redirect('/campgrounds');
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    });
})

// Connect to server
app.listen(PORT, process.env.IP, function() {
    console.log('Yelpcamp has started');
});
