var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
// mongoose.connect('mongodb://localhost/nodeauth');
mongoose.connect('mongodb://punishman:hamza123@ds145667.mlab.com:45667/nodeauth');
var db = mongoose.connection;

// User Schema
var UserSchema = mongoose.Schema({
  username: {
    type: String,
    index: true
  },
  password:{
    type: String, required: true, bcrypt:true
  },
  email: {
    type: String,
  },
  name: {
    type: String
  }
  // profileimage: {
  //   type: String,
  // }
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserByUsername = function(username, callback){
  var query = {username : username};
  User.findOne(query,callback);
}

module.exports.getUserById = function(id, callback){
  User.findById(id, callback);
}
module.exports.comparePassword = function(candidatePassword, hash, callback){
  bcrypt.compare(candidatePassword, hash, function(err, isMatch){
      if(err) return call(err);
      callback(null, isMatch);
  });
}

module.exports.createUser = function(newUser,callback){
  bcrypt.hash(newUser.password, 10, function(err, hash){
    if(err) throw err;
    // set hashed password
    newUser.password = hash;

    // Create username
    newUser.save(callback);
  });
}
