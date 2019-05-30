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

let clubSchema = new mongoose.Schema({
    title: String,
    date: String,
    body: String,
    place: String,
    time: String,
    created: {type: Date, default: Date.now}
});
let Club = mongoose.model("Club", clubSchema);

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


// app.get("/short", function(req, res){
//   // console.log(req.session);
//   if(req.isAuthenticated()){
//     User.findById(req.session.passport.user, function(err, usertype){
//         if(err){
//             res.redirect("/home");
//         } else {
//             res.render("short", {usertype: usertype, user: true});
//         }
//     });
//   }else {
//     res.render("short", {usertype: null, user: false});
//   }
// });

// app.get("/clubregist", function(req, res){
//   // console.log(req.session);
//    User.findById(req.session.passport.user, function(err, usertype){
//        if(err){
//            res.redirect("/home");
//        } else {
//            res.render("clubregist", {usertype: usertype, user: true});
//        }
//    })
// });
app.get("/clubregist", function(req, res){
  if(req.isAuthenticated()){
    User.findById(req.session.passport.user, function(err, usertype){
        if(err){
            res.redirect("/home");
        } else {
           Club.find({}, function(err, club){ console.log(club);
            res.render("clubregist", {usertype: usertype , club: club, user: true});
           })
        }
    });
  }else{
    Club.find({}, function(err, club){ console.log(club);
     res.render("clubregist", {usertype: null , club: club, user: false});
    })
  }
});

app.get("/clubregist/:id", function(req, res){
  // console.log(req.session);
  let id = req.params.id;
  if(req.isAuthenticated()){
    User.findById(req.session.passport.user, function(err, usertype){
        if(err){
            res.redirect("/home");
        } else {
           Club.findById(id, function(err, club){ console.log(club);
            res.render("showclub", {usertype: usertype , club: club, user: true});
           })
        }
    });
  }else{
    Club.findById(id, function(err, club){ console.log(club);
     res.render("showclub", {usertype: null , club: club, user: false});
    })
  }
});

app.get("/addclub", function(req, res){
  res.render("addclub");
});

app.post("/addclub", function(req, res){
    // create blog
    console.log(req.body);
    console.log("===========")
    console.log(req.body);

    let data = {
      title: req.body.title,
      date: req.body.date,
      body: req.body.body,
      place: req.body.place,
      time: req.body.time
    }

    Club.create(data, function(err, newBlog){
        if(err){
            res.render("addclub");
        } else {
            //then, redirect to the index
            res.redirect("/home");
        }
    });
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

app.get("/blogs/:id/edit", function(req, res){
  // console.log(req.session);

  Blog.findById(req.params.id,(err,foundBlog)=>{
    if(err){
        res.redirect("/home");
    } else {
        // console.log(data);
        res.render("editpage", {blog: foundBlog});
    }
  })
});

app.get("/clubregist/:id/edit", function(req, res){
  // console.log(req.session);

  Club.findById(req.params.id,(err,foundClub)=>{
    if(err){
        res.redirect("/home");
    } else {
        // console.log(data);
        res.render("editclub", {club: foundClub});
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
   // res.render("home");
   if(req.isAuthenticated()){
     User.findById(req.session.passport.user, function(err, usertype){
         if(err){
             res.redirect("/home");
         } else {
           Club.find({},(err,data1)=>{
             if(err){
               console.log(err);
             }else{
               Blog.find({},(err,data2)=>{
                 if(err){
                   console.log(err);
                 }else{
                   res.render('home',{club:data1,blogs:data2,usertype:usertype,user:true})
                 }
               })
             }
           });
         }
     });
   }else{
     Club.find({},(err,data1)=>{
       if(err){
         console.log(err);
       }else{
         Blog.find({},(err,data2)=>{
           if(err){
             console.log(err);
           }else{
             res.render('home',{club:data1,blogs:data2,usertype:null,user:false})
           }
         })
       }
     });
   }



});


app.get("/aboutclub", function(req, res){
   res.render("aboutclub");
});

// app.get("/clubregist", function(req, res){
//    res.render("clubregist");
// });

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


app.get("/exchange", function(req, res){
  if(req.isAuthenticated()){
    User.findById(req.session.passport.user, function(err, usertype){
        if(err){
            res.redirect("/home");
        } else {
           Blog.find({type: "exchange"}, function(err, blogs){
            res.render("exchange", {usertype: usertype , blogs: blogs, user: true});
           })
        }
    });
  }else{
    Blog.find({type: "exchange"}, function(err, blogs){
     res.render("exchange", {usertype: null , blogs: blogs, user: false});
    })
  }
});

app.post("/addpage", function(req, res){
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
      type: req.body.type
    }

    Blog.create(data, function(err, newBlog){
        if(err){
            res.render("addpage");
        } else {
            //then, redirect to the index
            res.redirect("/home");
        }
    });
});

app.get("/internship", function(req, res){
  if(req.isAuthenticated()){
    User.findById(req.session.passport.user, function(err, usertype){
        if(err){
            res.redirect("/home");
        } else {
           Blog.find({type: "internship"}, function(err, blogs){
            res.render("internship", {usertype: usertype , blogs: blogs, user: true});
           })
        }
    });
  }else{
    Blog.find({type: "internship"}, function(err, blogs){
     res.render("internship", {usertype: null , blogs: blogs, user: false});
    })
  }
});


app.get("/short", function(req, res){
  if(req.isAuthenticated()){
    User.findById(req.session.passport.user, function(err, usertype){
        if(err){
            res.redirect("/home");
        } else {
           Blog.find({type: "short"}, function(err, blogs){
            res.render("short", {usertype: usertype , blogs: blogs, user: true});
           })
        }
    });
  }else{
    Blog.find({type: "short"}, function(err, blogs){
     res.render("short", {usertype: null , blogs: blogs, user: false});
    })
  }
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
});

// DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
   //destroy blog
   Blog.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/home");
       } else {
           res.redirect("/home");
       }
   })
   //redirect somewhere
});

app.delete("/clubregist/:id", function(req, res){
   //destroy blog
   Blog.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/home");
       } else {
           res.redirect("/home");
       }
   })
   //redirect somewhere
});

app.post('/blogs/:id/edit',function(req, res){
	// console.log(req.session.passport.user);
  let id = req.params.id;
	const university = req.body.university;
	const country = req.body.country;
	const levelofstudy = req.body.levelofstudy;
	const date = req.body.date;
	const body = req.body.body;
	// const usertype = 0;

	let data = {
			university:university,
	  	country:country,
	  	levelofstudy:levelofstudy,
	    date:date,
	    body:body
	}

	Blog.findByIdAndUpdate(id,data,(err,data)=>{
		if(err){
			console.log(err);
			res.redirect('/');
		}else{
			console.log(data);
			res.redirect('/blogs/'+id);
		}
	})
});

app.post('/clubregist/:id',function(req, res){
	// console.log(req.session.passport.user);
  let id = req.params.id;
	const title = req.body.title;
	const date = req.body.date;
	const body = req.body.body;
	const place = req.body.place;
	const time = req.body.time;
	// const usertype = 0;

	let data = {
			title:title,
	  	date:date,
	  	body:body,
	    place:place,
	    time:time
	}

	Club.findByIdAndUpdate(id,data,(err,data)=>{
		if(err){
			console.log(err);
			res.redirect('/');
		}else{
			console.log(data);
			res.redirect('/clubregist/'+id);
		}
	})
});



// Start Server
app.listen(3000, function(){
  console.log('Server started on port 3000...');
});
