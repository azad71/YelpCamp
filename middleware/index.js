var Campground = require("../models/campground"),
    Comment = require("../models/comment"),
    middlewareObj = {};

 middlewareObj.checkCampOwnership = function(req, res, next){
     if(req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCampground) {
           if(err) {
               req.flash("error", "Campground not found");
               res.redirect("back");
           } else {
              if(foundCampground.author.id.equals(req.user._id)) {
                   next();
              } else {
                  req.flash("error", "You don't have permission to do that");
                  res.redirect("/campgrounds/" + foundCampground._id);
              }
           }
        });
    } else {
        req.flash("error", "You need to be logged in first");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
   if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComments) {
           if(err) {
               req.flash("error", "Comment not found");
               res.redirect("back");
           } else {
               if(foundComments.author.id.equals(req.user._id)) {
                  next();
               } else {
                   req.flash("You don't have permission to do that");
                   res.redirect("back");
               }
           }
        });
    } else {
        req.flash("error", "You need to be logged in first");
        res.redirect("back");
    }  
};

middlewareObj.isLoggedIn = function(req, res, next) {
  if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in first");
    res.redirect("/login");  
};

module.exports = middlewareObj;