var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();


// Sets the view engine to ejs
app.set('view engine', 'ejs');

// Home page
app.get('/', function(req, res){
	res.render('landing');
});


// Campground link
app.get('/campgrounds', function(req, res){
var campgrounds = [
	{name: 'Lake Tahoe', image: 'http://hdontap.com/images/uploads/gallery_images/104/riva3.jpeg'},
	{name: 'Yosemite', image: 'http://castle.eiu.edu/~wow/classes/fa09/Yosemite/yose_valley.jpg'},
	{name: 'Death Valley', image: 'http://img06.deviantart.net/62bd/i/2012/332/4/6/death_valley__campground_by_alierturk-d5mi6rb.jpg'}
];
	res.render('campgrounds', {campgrounds: campgrounds});
});


// Connect to server
app.listen(PORT, process.env.IP, function(){
	console.log('Yelpcamp has started')
});