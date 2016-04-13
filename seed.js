var mongoose = require('mongoose');
var Campground = require('./models/campground');
var Comment = require('./models/comment');


var data = [{
    name: 'Cloud\'s Rest',
    image: 'https://farm2.staticflickr.com/1281/4684194306_18ebcdb01c.jpg',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus mi orci, cursus non metus ac, feugiat gravida nisl. Nunc a dapibus leo. Pellentesque dolor lectus, auctor sit amet magna sit amet, porta rutrum mauris. Integer eget condimentum turpis, non mollis mauris.'
}, {
    name: 'Lala Land',
    image: 'https://farm9.staticflickr.com/8422/7842069486_c61e4c6025.jpg',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus mi orci, cursus non metus ac, feugiat gravida nisl. Nunc a dapibus leo. Pellentesque dolor lectus, auctor sit amet magna sit amet, porta rutrum mauris. Integer eget condimentum turpis, non mollis mauris.'
}, {
    name: 'The Bubble',
    image: 'https://farm5.staticflickr.com/4048/4661960920_a9bd6d972f.jpg',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus mi orci, cursus non metus ac, feugiat gravida nisl. Nunc a dapibus leo. Pellentesque dolor lectus, auctor sit amet magna sit amet, porta rutrum mauris. Integer eget condimentum turpis, non mollis mauris.'
}];

function seedDB(){
   //Remove all campgrounds
   Campground.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed campgrounds!");
         //add a few campgrounds
        data.forEach(function(seed){
            Campground.create(seed, function(err, campground){
                if(err){
                    console.log(err)
                } else {
                    console.log("added a campground");
                    //create a comment
                    Comment.create(
                        {
                            text: "This place is great, but I wish there was internet",
                            author: "Homer"
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            } else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log("Created new comment");
                            }
                        });
                }
            });
        });
    }); 
    //add a few comments
}module.exports = seedDB;
