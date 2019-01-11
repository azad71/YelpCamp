const express = require("express"),
      router  = express.Router(),
      Campground = require("../models/campground"),
      middleware = require("../middleware");

//Index - displays all posts
router.get("/", function(req, res){
    Campground.find({}, function(err, allCampgrounds){
       if(err) {
           console.log(err);
       } else {
          res.render("campgrounds/index", {campgrounds : allCampgrounds, currentUser : req.user});
       }
    });
});

//Create - new posts
router.post("/", middleware.isLoggedIn, function(req, res){
    var campName = req.body.campName;
    var imgurl = req.body.imgurl;
    var desc = req.body.desc;
    var price = req.body.price
    var author = {
      id : req.user._id,
      username : req.user.username,
    };
    var newCamp = {name : campName, price : price, image : imgurl, desc : desc, author : author};
    
    //create a new campground and save it to db
    Campground.create(newCamp, function(err, newlyCreatedCamp){
        if(err) {
            console.log("Something wrong!");
        }
        else {
             //redirect back to campgrounds(GET) page
            res.redirect("/campgrounds");     
        }
    });
});


//New - shows a new form for new post entry
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");    
});

//Show - infos about specific one post
router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) =>{
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground : foundCampground});
        }
    });
});

//EDIT ROUTE
router.get("/:id/edit", middleware.checkCampOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        res.render("campgrounds/edit", {campground : foundCampground});
    });
});
//UPDATE ROUTE
router.put("/:id", middleware.checkCampOwnership, function(req, res) {
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
      if(err) {
          res.redirect("/campgrounds");
      } else {
          res.redirect("/campgrounds/" + req.params.id);
      }
   });
});

//DELETE ROUTE
router.delete("/:id", middleware.checkCampOwnership, function(req, res) {
   Campground.findByIdAndRemove(req.params.id, function(err) {
      if(err) {
          res.send("Required Data Doesn't exist in Database");
      } else {
          res.redirect("/campgrounds");
      }
   });
});

module.exports = router;