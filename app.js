const express 		= require('express');
const path 			= require('path');
const mongoose 		= require('mongoose');
const bodyParser 	= require('body-parser');
const expressValidator = require('express-validator');
const session 		= require('express-session');
const flash 		= require('connect-flash');
const methodOverride = require("method-override");
const expressSanitizer = require("express-sanitizer");
const passport 		= require('passport');
const app      		= express();
const config		= require('./config/database');

mongoose.connect(config.database);
let db = mongoose.connection;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// MONGOOSE/MODEL CONFIG
let blogSchema = new mongoose.Schema({
    university: String,
    country: String,
    levelofstudy: String,
    date: String,
    body: String,
    type: String,
    created: {type: Date, default: Date.now}
});
let Blog = mongoose.model("Blog", blogSchema);
// Check connection
db.once('open', function(){
  console.log('Connected to MongoDB');
});

// Check for DB errors
db.on('error', function(err){
  console.log(err);
});

// Bring in Models
let Program = require('./models/program');

let User = require('./models/user');

// Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Passport Config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());



app.get("/internship", function(req, res){
  // console.log(req.session);
  if(req.isAuthenticated()){
    User.findById(req.session.passport.user, function(err, usertype){
        if(err){
            res.redirect("/home");
        } else {
            res.render("internship", {usertype: usertype, user: true});
        }
    });
  }else {
    res.render("internship", {usertype: null, user: false});
  }
});

app.get("/short", function(req, res){
  // console.log(req.session);
   User.findById(req.session.passport.user, function(err, usertype){
       if(err){
           res.redirect("/home");
       } else {
           res.render("short", {usertype: usertype});
       }
   })
});

app.get("/clubregist", function(req, res){
  // console.log(req.session);
   User.findById(req.session.passport.user, function(err, usertype){
       if(err){
           res.redirect("/home");
       } else {
           res.render("clubregist", {usertype: usertype});
       }
   })
});

app.get("/newpost", function(req, res){
  // console.log(req.session);
   User.findById(req.session.passport.user, function(err, usertype){
       if(err){
           res.redirect("/home");
       } else {
           res.render("new", {usertype: usertype});
       }
   })
});

app.get("/profile/edit", function(req, res){
  // console.log(req.session);

  User.findById( req.session.passport.user,(err,data)=>{
    if(err){
        res.redirect("/home");
    } else {
        console.log(data);
        res.render("profile_edit", {usertype: data});
    }
  })
});

app.get("/:id/edit", function(req, res){
  console.log(req.session);

  User.findById( req.session.passport.user,(err,data)=>{
    if(err){
        res.redirect("/home");
    } else {
        console.log(data);
        res.render("editpage", {usertype: data});
    }
  })
});


app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

app.get("/", function(req, res){
   res.redirect("/home");
});

app.get("/home", function(req, res){
   res.render("home");
});

// app.get("/exchange", function(req, res){
//    res.render("exchange");
// });

app.get("/internship", function(req, res){
});

app.get("/short", function(req, res){
   res.render("short");
});

app.get("/aboutclub", function(req, res){
   res.render("aboutclub");
});

app.get("/clubregist", function(req, res){
   res.render("clubregist");
});

app.get("/contact", function(req, res){
   res.render("contact");
});

app.get("/aboutus", function(req, res){
   res.render("aboutus");
});

app.get("/signin", function(req, res){
   res.render("signin");
});

app.get("/profile", function(req, res){
   res.render("profile_signin");
});

app.get("/newpost", function(req, res){
   res.render("new");
});

app.get("/addpage", function(req, res){
   res.render("addpage");
});

//Route File
let users = require('./routes/users');
app.use('/users',users);

// Start Server
app.listen(3000, function(){
  console.log('Server started on port 3000...');
});

// CREATE ROUTE
app.post("/exchange", function(req, res){
    // create blog
    console.log(req.body);
    console.log("===========")
    console.log(req.body);

    let data = {
      university: req.body.university,
      country: req.body.country,
      levelofstudy: req.body.levelstd,
      date: req.body.datedl,
      body: req.body.desc,
      type: 'exchange'
    }

    Blog.create(data, function(err, newBlog){
        if(err){
            res.render("addpage");
        } else {
            //then, redirect to the index
            res.redirect("/exchange");
        }
    });
});

// SHOW ROUTE
app.get("/blogs/:id", function(req, res){
  if(req.isAuthenticated()){
    User.findById(req.session.passport.user, function(err, usertype){
        if(err){
            res.redirect("/home");
        } else {
           Blog.findById(req.params.id, function(err, blogs){
            res.render("show", {usertype: usertype , blog: blogs});
           })
        }
    });
  }else{
    Blog.findById(req.params.id, function(err, blogs){
      console.log(blogs);
     res.render("show", {usertype: null , blog: blogs});
    })
  }
   // Blog.findById(req.params.id, function(err, foundBlog){
   //     if(err){
   //         res.redirect("/blogs");
   //     } else {
   //         res.render("show", {blog: foundBlog});
   //     }
   // })
});

// app.get("/exchange", function(req, res){
//    Blog.find({}, function(err, blogs){
//        if(err){
//            console.log("ERROR!");
//        } else {
//           res.render("exchange", {blogs: blogs});
//        }
//    });
// });

app.get("/exchange", function(req, res){
  // console.log(req.session.passport.user);
  if(req.isAuthenticated()){
    User.findById(req.session.passport.user, function(err, usertype){
        if(err){
            res.redirect("/home");
        } else {
           Blog.find({type: "exchange"}, function(err, blogs){
            res.render("exchange", {usertype: usertype , blogs: blogs});
           })
        }
    });
  }else{
    Blog.find({}, function(err, blogs){
     res.render("exchange", {usertype: null , blogs: blogs});
    })
  }

});
