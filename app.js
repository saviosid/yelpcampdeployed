
var express             = require("express");
var app                 = express();
var Campground          = require("./models/campground");
var seedDB              = require("./seeds");
var Comment             = require("./models/comment");
var passport            = require("passport");
var LocalStrategy       = require("passport-local");
var methodOverride      = require("method-override");
var User                = require("./models/user");
var commentRoutes       = require("./routes/comments");
var campgroundRoutes    = require("./routes/campgrounds");
var indexRoutes         = require("./routes/index");
var bodyParser          = require("body-parser");
var flash               = require("connect-flash");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname +"/public"));
app.use(methodOverride("_method"));
app.use(flash());

//connecting to DB
var mongoose = require("mongoose");
//mongoose.connect("mongodb://localhost:27017/yelp_camp",{useNewUrlParser: true}); //local URL
//mongoose.connect("mongodb://default:default1234@ds137003.mlab.com:37003/saviosdb"); // MLab URK
mongoose.connect(process.env.DATABASEURL);

//mongodb://<dbuser>:<dbpassword>@ds137003.mlab.com:37003/saviosdb
//seedDB();


//Passport Configuration
    app.use(require("express-session")({
        secret: "Just Testing",
        resave: false,
        saveUninitialized: false
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    // middleware to pass currentUser to all routes
    app.use(function(req, res, next){
        res.locals.currentUser = req.user;
        res.locals.error = req.flash("error");
        res.locals.success = req.flash("success");
        next();
    });


    // routes usage
    app.use(campgroundRoutes);
    app.use(commentRoutes);
    app.use(indexRoutes);
    


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Yelp Camp Server Started.....")
});