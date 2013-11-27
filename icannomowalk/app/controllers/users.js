var passport = require('../helpers/passport')
  , cryptPass = passport.cryptPass
  , requireAuth = passport.requireAuth;
var measurement = require("../helpers/measurement.js");  

var Users = function () {
  this.before(requireAuth, {
    except: ['add', 'create']
  });

  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.index = function (req, resp, params) {
    var self = this;

    geddy.model.User.all(function(err, users) {
      self.respond({params: params, users: users});
    });
  };

  this.add = function (req, resp, params) {
    this.respond({params: params,user:null});
  };

  this.create = function (req, resp, params) {
    var self = this
      , user = geddy.model.User.create(params)
      , sha;

    // Non-blocking uniqueness checks are hard
    geddy.model.User.first({username: user.username}, function(err, data) {
      if (data) {
        params.errors = {
          username: 'This username is already in use.'
        };
        self.transfer('add');
      }
      else {
        if (user.isValid()) {
          user.password = cryptPass(user.password);
          user.measurements = [];
          user.devices = [];
          user.goals = [];
          user.friends = [];
        }
        user.save(function(err, data) {
          if (err) {
            params.errors = err;
            self.transfer('add');
          }
          else {
            self.redirect({controller: self.name});
          }
        });
      }
    });

  };

  this.show = function (req, resp, params) {
    var self = this;

    geddy.model.User.first(params.id, function(err, user) {
      if (!user) {
        var err = new Error();
        err.statusCode = 400;
        self.error(err);
      } else {
        user.getGroups(function(err,groups){
          if(err){
            throw err;
          }
          else
          {
            user.totalsteps = user.totalSteps();
            self.respond({user:user,groups:groups});
          }
        });
      }
    });
  };
  this.edit = function (req, resp, params) {
    var self = this;

    geddy.model.User.first(params.id, function(err, user) {
      if (!user) {
        var err = new Error();
        err.statusCode = 400;
        self.error(err);
      } else {
        self.respond({params: params, user: user});
      }
    });
  };

  this.update = function (req, resp, params) {
    var self = this;

    geddy.model.User.first(params.id, function(err, user) {
      // Only update password if it's changed
      var skip = params.password ? [] : ['password'];

      user.updateAttributes(params, {skip: skip});

      if (params.password && user.isValid()) {
        user.password = cryptPass(user.password);
      }

      user.save(function(err, data) {
        if (err) {
          params.errors = err;
          self.transfer('edit');
        } else {
          self.redirect({controller: self.name});
        }
      });
    });
  };

  this.destroy = function (req, resp, params) {
    var self = this;

    geddy.model.User.remove(params.id, function(err) {
      if (err) {
        params.errors = err;
        self.transfer('edit');
      } else {
        self.redirect({controller: self.name});
      }
    });
  };

this.addSteps = function (req,resp,params){
    var self = this;
    geddy.model.User.first(params.id,function(err,user){  
      if(err)
       throw err;

      self.respondWith(user);

    });
  };

this.createSteps = function (req,resp,params){
    var self = this;
    var upload = geddy.date.parse(params.date);
    //var steps = geddy.model.Step.create({steps:params.steps,date: new Date(upload)});
    var steps = new measurement(12345,parseInt(params.steps),new Date(upload));
    geddy.model.User.first(params.id, function(err,user){
      if(err)
       throw err;
      if(!user)
      {
        throw new geddy.errors.NotFoundError(); 
      }
      else
      {
        user.steps.push(steps);
        user.save(function(err,data){
          if(err)
            throw err;
          self.redirect({controller: 'users', action: 'show', id: user.id});
          //self.respondWith(user,{status:err});
        });
      }
    });
  };

  this.getSteps = function(req,resp, params){
    var self  = this;

    geddy.model.User.first(params.id,function(err,user){
      if(err){
        self.respond(error);
      }
      if (!user) {
        throw new geddy.errors.NotFoundError();
      }
      else
      {
        var laststeps = user.lastLookedAt ? user.lastLookedAt.steps : 0;
        var data = {user:user.id,totalsteps:user.totalSteps(),laststeps:laststeps};
        /*if(user.lastLookedAt == null)
        {
          user.lastLookedAt = {steps:user.totalSteps(),date:new Date()};
        }
        else
        {
          var today = new Date();
          var steps = user.lastLookedAt.steps + user.stepsFromDateToDate(new Date(user.lastLookedAt.date.getTime()+1),today);
          user.lastLookedAt = {steps:steps, date: today};
        }*/
        user.lastLookedAt = {steps:user.totalSteps(),date:new Date()};
        user.save();
        self.respond({data:data},{format:'json'});
      }
    });
  };

  this.addMultiSteps = function(req,resp,params) {
    var self = this;
    geddy.model.User.first(params.id, function(err,user){
      if(err)
       throw err;
      if(!user)
      {
        throw new geddy.errors.NotFoundError(); 
      }
      else
      {
        self.respond({user:user});
      }
    });
  };

  this.createMultiSteps = function(req,resp,params) {
    var self = this;

    geddy.model.User.first(params.id, function(err,user){
      if(err)
       throw err;
      if(!user)
      {
        throw new geddy.errors.NotFoundError(); 
      }
      else
      {
        user.addSteps(new Date(params.startdate),new Date(params.enddate));
        self.redirect({controller: 'users', action: 'show', id: user.id});
      }
    });
  };

  this.walk = function(req,resp,params){
    var self = this;
    geddy.model.User.first(params.id,function(err,user){
      if(err){
        self.respond(error);
      }
      if (!user) {
        throw new geddy.errors.NotFoundError();
      }
      else
      {
        var laststeps = user.lastLookedAt ? user.lastLookedAt.steps : 0;
        var data = {user_id:user.id,user_name:user.name,totalsteps:user.totalSteps(),laststeps:laststeps};
        /*if(user.lastLookedAt == null)
        {*/
          user.lastLookedAt = {steps:user.totalSteps(),date:new Date()};
        /*}
        else
        {
          var today = new Date();
          var steps = user.lastLookedAt.steps + user.stepsFromDateToDate(new Date(user.lastLookedAt.date.getTime()+1),today);
          console.log(user.stepsFromDateToDate(new Date(user.lastLookedAt.date.getTime()+1),today));
          user.lastLookedAt = {steps:steps, date: today};
        }*/
        user.save();
        self.respond({data:data});
      }
    });
  };

};

exports.Users = Users;
