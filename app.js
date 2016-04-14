var PORT              = process.env.PORT || 3000,
    express           = require('express'),
    bodyParser        = require('body-parser'),
    mongoose          = require('mongoose'),
    passport          = require('passport'),
    LocalStrategy     = require('passport-local'),
    methodOverride    = require('method-override'),
    Campground        = require('./models/campground'),
    Comment           = require('./models/comment'),
    User              = require('./models/user'),
    seedDB            = require('./seed');


// requiring Routes

var commentRoutes   = require('./routes/comments'),
    campgroundRoutes = require('./routes/campgrounds'),
    indexRoutes      = require('./routes/index');


mongoose.connect('mongodb://localhost/yelpcamp');
var app = express();

// Set up body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// Sets the view engine to ejs
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
// seedDB(); // seed the database

//=============
// PASSPORT CONFIGURATION
//=============
app.use(require('express-session')({
    secret: "I'm gonna be a fullstack software engineer!",
    resave: false,
    saveUninitialized: false
}));

// Check if logged in middleware
var isLoggedIn = function(req, res, next){
    if(req.isAuthenticated){
        return next();
    } else {
        res.redirect('/login');
    }
};

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); // the .authenticate comes from the local strategy we added in user model
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Runs for every single route so currentUser is saved as a global variable to every template as well
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
})



app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes); // appends /campgrounds to every route in the route file
app.use('/campgrounds/:id/comments', commentRoutes); // appends the 1st parameter to every single route file


// Connect to server
app.listen(PORT, process.env.IP, function() {
    console.log('Yelpcamp has started');
});
