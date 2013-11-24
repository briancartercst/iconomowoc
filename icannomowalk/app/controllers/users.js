var stepmodel = require("../helpers/step.js")
//var $ = require("jquery")
var Users = function () {
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.index = function (req, resp, params) {
    var self = this;

    geddy.model.User.all(function(err, users) {
      self.respondWith(users, {type:'User'});
    });
  };

  this.add = function (req, resp, params) {
    this.respond({params: params});
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
    var steps = new stepmodel(parseInt(params.steps),new Date(upload));
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

  this.create = function (req, resp, params) {
    var self = this
      , user = geddy.model.User.create(params);

    if (!user.isValid()) {
      this.respondWith(user);
    }
    else {
      user.steps = [];
      user.save(function(err, data) {
        if (err) {
          throw err;
        }
        self.respondWith(user, {status: err});
      });
    }
  };

  this.show = function (req, resp, params) {
    var self = this;

    geddy.model.User.first(params.id, function(err, user) {
      if (err) {
        throw err;
      }
      if (!user) {
        throw new geddy.errors.NotFoundError();
      }
      else {
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

  this.edit = function (req, resp, params) {
    var self = this;

    geddy.model.User.first(params.id, function(err, user) {
      if (err) {
        throw err;
      }
      if (!user) {
        throw new geddy.errors.BadRequestError();
      }
      else {
        self.respondWith(user);
      }
    });
  };

  this.update = function (req, resp, params) {
    var self = this;

    geddy.model.User.first(params.id, function(err, user) {
      if (err) {
        throw err;
      }
      user.updateProperties(params);

      if (!user.isValid()) {
        self.respondWith(user);
      }
      else {
        user.save(function(err, data) {
          if (err) {
            throw err;
          }
          self.respondWith(user, {status: err});
        });
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

  this.remove = function (req, resp, params) {
    var self = this;

    geddy.model.User.first(params.id, function(err, user) {
      if (err) {
        throw err;
      }
      if (!user) {
        throw new geddy.errors.BadRequestError();
      }
      else {
        geddy.model.User.remove(params.id, function(err) {
          if (err) {
            throw err;
          }
          self.respondWith(user);
        });
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
