var passport = require('../helpers/passport')
  , cryptPass = passport.cryptPass
  , requireAuth = passport.requireAuth;
var measurement = require("../helpers/measurement.js"); 

var Adminusers = function () {
  this.before(requireAuth, {
    //except: ['add', 'create']
  });

  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];


};

exports.Adminusers = Adminusers;