var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    // seedDB = require("./seeds"),
    passport = require("passport"),
    methodOverride = require("method-override"),
    localStrategy = require("passport-local"),
    User = require("./models/user"),
    campRoutes = require("./routes/campgrounds"),
    commentRoutes = require("./routes/comments"),
    indexRoutes = require("./routes/index");

var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp";

// seedDB();
mongoose.connect(url, {useNewUrlParser : true});
mongoose.set("useFindAndModify", false);
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.set("view engine", "ejs");


//PASSPORT CONFIGURATION

app.use(require("express-session") ({ //must be declared before passport session and initialize method
    secret : "Wubba lubba dub dub",
    saveUninitialized : false,
    resave : false
}));

app.use(passport.initialize()); //must declared before passport.session()
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser   = req.user;
   res.locals.error         = req.flash("error");
   res.locals.success       = req.flash("success");
   next();
});



app.use(indexRoutes);
app.use("/campgrounds", campRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


app.listen(process.env.PORT, process.env.IP);
