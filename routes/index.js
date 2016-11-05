var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var db = mongoose.connection;

/* GET home page. */
router.get('/', ensureAuthenticated,function(req, res, next) {
  db.collection('users').find().toArray(function(err, results) {
  if (err) throw err;
  console.log(results)
  // send HTML file populated with quotes here
    res.render('index', { title: 'Members', ListOfUsers: results});
  });


});


function ensureAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/users/login')
}

module.exports = router;
