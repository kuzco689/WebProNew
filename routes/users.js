const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const session 		= require('express-session');

// Bring in User Model
let User = require('../models/user');

router.post('/register',function(req, res){
	const username = req.body.username;
	const name = req.body.name;
	const faculty = req.body.faculty;
	const dep = req.body.dep;
	const major = req.body.major;
	const email = req.body.email;
	const password = req.body.password;
	const password2 = req.body.password2;
	const usertype = 0;

	    let newUser = new User({
	      username:username,
	      name:name,
	      faculty:faculty,
	      dep:dep,
	      major:major,
	      email:email,
	      password:password,
				usertype:usertype
	    });

	    bcrypt.genSalt(10, function(err, salt){
	      bcrypt.hash(newUser.password, salt, function(err, hash){
	        if(err){
	          console.log(err);
	        }
	        newUser.password = hash;
	        newUser.save(function(err){
	          if(err){
	            console.log(err);
	            return;
	          } else {
	            res.redirect('/signin');
	          }
	        });
	      });
	    });
});

router.post('/edit',function(req, res){
	// console.log(req.session.passport.user);

	const username = req.body.username;
	const name = req.body.name;
	const faculty = req.body.faculty;
	const dep = req.body.dep;
	const major = req.body.major;
	const email = req.body.email;
	// const usertype = 0;

	let data = {
		username:username,
	 name:name,
	 faculty:faculty,
	  dep:dep,
	       major:major,
	       email:email,
	}

	User.findByIdAndUpdate(req.session.passport.user,data,(err,data)=>{
		if(err){
			console.log(err);
			res.redirect('/');
		}else{
			console.log(data);
			res.redirect('/profile');
		}
	})
});

router.post('/blogs/:id/edit',function(req, res){
	// console.log(req.session.passport.user);

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

	User.findByIdAndUpdate(req.session.passport.user,data,(err,data)=>{
		if(err){
			console.log(err);
			res.redirect('/');
		}else{
			console.log(data);
			res.redirect('/blogs/:id');
		}
	})
});

router.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

router.use(passport.initialize());
router.use(passport.session());

// Login Process
router.post('/login', function(req, res, next){
  passport.authenticate('local', {
    successRedirect:'/home',
    failureRedirect:'/signin',
    failureFlash: true
  })(req, res, next);
});

// logout
router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/home');
});


// router.get("/exchange", function(req, res){
//    User.findById(req.session.passport.user, function(err, usertype){
//        if(err){
//            res.redirect("/home");
//        } else {
//            res.render("exchange", {usertype: usertype});
//        }
//    })
// });

module.exports = router;
