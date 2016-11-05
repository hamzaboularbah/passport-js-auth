var express = require('express');
var User = require('../models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var router = express.Router();
var isConnected = false;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  if(isConnected) {
    res.redirect('/');
  } else {
    res.render('register', {title : 'Register'});
  }

});

router.get('/login', function(req, res, next) {
  if(isConnected) {
    res.redirect('/');
  } else {
    res.render('login', {title : 'Login'});
  }

});


router.post('/register', function(req, res, next) {
  // Get the form values
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;


  //form validation
  req.checkBody('name','Name field is required').notEmpty();
  req.checkBody('email','Email field is required').notEmpty();
  req.checkBody('email','Email not valid !').isEmail();
  req.checkBody('username','Username field is required').notEmpty();
  req.checkBody('password','Password field is required').notEmpty();
  req.checkBody('password2','Passwords do not match').equals(req.body.password);

  // Check for errors
var errors = req.validationErrors();
  if(errors){
    console.log('7baaas n3am assi');
    res.render('register',{
      errors : errors,
      name : name,
      email : email,
      username : username,
      password : password,
      password2 : password2
    });
  } else {
    var newUser = new User({
      name : name,
      email : email,
      username : username,
      password : password
    });

    // create User
    User.createUser(newUser,function(err,user){
      if(err) throw err;
      console.log(user);
    });

    //success message
    req.flash('success', 'You are now Registred and may Log In');
    res.location('/');
    res.redirect('/');
  }
});

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});


passport.use(new LocalStrategy(
  function(username, password, done) {
    User.getUserByUsername(username, function(err, user){
      if(err) throw err;
      if(!user){
        console.log('Unkown User!');
        return done(null, false, {message: 'Unknown user'});
      }

      User.comparePassword(password, user.password, function(err, isMatch){
        if(err) throw err;
        if(isMatch){
          return done(null, user);
        }else {
          return done(null, false, {message:'Invalid password'});
        }
      });
    });

  }
));


router.post('/login', passport.authenticate('local',{failureRedirect: '/users/login', failureFlash: 'Invalid Username or Password'}), function(req,res){
  console.log('Authentication Successful !');
  isConnected = true;
  req.flash('success', 'You are logged in');
  res.redirect('/');
});

router.get('/logout', function(req,res){
  req.logout();
  isConnected = false;
  req.flash('success', 'You have Logged out');
  res.redirect('/users/login');
});
module.exports = router;
