//var arraydiff = require("../helpers/array.js")
var Groups = function () {
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.index = function (req, resp, params) {
    var self = this;

    geddy.model.Group.all(function(err, groups) {
      self.respondWith(groups, {type:'Group'});
    });
  };

  this.add = function (req, resp, params) {
    var self = this;
    geddy.model.Challenge.all(function(err,challenges)
    {
      self.respond({params: params,challenges:challenges});
    });
    
  };

  this.create = function (req, resp, params) {
    var self = this
      , group = geddy.model.Group.create(params);

    if (!group.isValid()) {
      this.respondWith(group);
    }
    else {
      group.save(function(err, data) {
        if (err) {
          throw err;
        }
        self.respondWith(group, {status: err});
      });
    }
  };

  /*this.show = function (req, resp, params) {
    var self = this;

    geddy.model.Group.first(params.id, function(err, group) {
      if (err) {
        throw err;
      }
      if (!group) {
        throw new geddy.errors.NotFoundError();
      }
      else {
        self.respondWith(group);
      }
    });
  };
*/
  this.show = function(req,resp,params) {
    var self = this;
     geddy.model.Group.first(params.id, function(err, group) {
        if (err) {
          throw err;
        }
        if (!group) {
          throw new geddy.errors.NotFoundError();
        }
        else {
          group.getChallenge(function(error,chal){
            if(error){
	            throw error;
	          }
            else{
              group.getUsers(function(error,users){
                if(error){
                  throw error;
                }
                else{
                  self.respond({challenge:chal,group:group,users:users});
                }
              });
            }
	        });
        }
      });
  };

  this.addUsersToGroup = function(req,resp,params){
    var self = this;
    geddy.model.Group.first(params.id, function(err, group) {
      if (err) {
        throw err;
      }
      if (!group) {
        throw new geddy.errors.NotFoundError();
      }
      else {
        group.getUsers(function(error,users){
          var notl = [];
          for(var x = 0; x < users.length; x++)
          {
            var us = {id:users[x].id};
            notl.push(us);
          }
          if(users.length > 0 )
          {
            query = {not:{or:notl}};
          }
          else
          {
            query = "";
          }  

          geddy.model.User.all(query,function(err,returnedusers){
            self.respond({group:group,users:returnedusers})
          });
        });
        /*geddy.model.User.all(function(err,user){
          group.getUsers(function(error,users)
          {
            var returnedusers = arraydiff(user,users);
            self.respond({group:group,users:returnedusers});
          });
        });*/
      }
    });
  };

  this.addUsers = function(req,resp,params){
    var self = this;
    geddy.model.Group.first(params.id, function(err, group) {
      if (err) {
        throw err;
      }
      if (!group) {
        throw new geddy.errors.NotFoundError();
      }
      else {
        geddy.model.User.first(params.user, function(err,user){
        if(err)
         throw err;
        if(!user)
        {
          throw new geddy.errors.NotFoundError(); 
        }
        else
        {
          group.addUser(user);
          group.save();
        }
        self.redirect({controller: 'groups', action: 'show', id: group.id});
      });
     }
    });
  };

  this.getSteps = function(req,resp, params){
    var self  = this;

    geddy.model.Group.first(params.id,function(err,group){
      if(err){
        self.respond(error);
      }
      if (!group) {
        throw new geddy.errors.NotFoundError();
      }
      else
      {
        group.getChallenge(function(err,challenge){
          if(err){
            throw err;
          }
          group.getUsers(function(error,users){
            var total = 0;
            if(error){
              throw error;
            }
            else{
              for(var x = 0; x< users.length; x++)
                {
                  total += users[x].stepsFromDateToDate(challenge.start,challenge.end);
                }
            }
            var laststeps = group.lastLookedAt ? group.lastLookedAt.steps : 0;
            group.lastLookedAt = {steps:total, date:new Date()};
            group.save();
            var data = {group:group.id,totalsteps:total,laststeps:laststeps};
            self.respond({data:data},{format:'json'});
          });
        });
      }
    });
  };

  this.edit = function (req, resp, params) {
    var self = this;

    geddy.model.Group.first(params.id, function(err, group) {
      if (err) {
        throw err;
      }
      if (!group) {
        throw new geddy.errors.BadRequestError();
      }
      else {
        geddy.model.Challenge.all(function(err,challenges)
        {
          self.respond({group: group,challenges:challenges});
        });
      }
    });
  };

  this.update = function (req, resp, params) {
    var self = this;

    geddy.model.Group.first(params.id, function(err, group) {
      if (err) {
        throw err;
      }
      group.updateProperties(params);

      if (!group.isValid()) {
        self.respondWith(group);
      }
      else {
        group.save(function(err, data) {
          if (err) {
            throw err;
          }
          self.respondWith(group, {status: err});
        });
      }
    });
  };

  this.remove = function (req, resp, params) {
    var self = this;

    geddy.model.Group.first(params.id, function(err, group) {
      if (err) {
        throw err;
      }
      if (!group) {
        throw new geddy.errors.BadRequestError();
      }
      else {
        geddy.model.Group.remove(params.id, function(err) {
          if (err) {
            throw err;
          }
          self.respondWith(group);
        });
      }
    });
  };

  this.walk = function(req,resp,params){
    var self = this;
    geddy.model.Group.first(params.id,function(err,group){
      if(err){
        self.respond(error);
      }
      if (!group) {
        throw new geddy.errors.NotFoundError();
      }
      else
      {
        var laststeps = group.lastLookedAt ? group.lastLookedAt.steps : 0;
        var data = {group_id:group.id,group_name:group.name,totalsteps:0,averagesteps:0,laststeps:laststeps,lastaverage:0};
        group.getChallenge(function(err,challenge){
          if(err){
            throw err;
          }
          group.getUsers(function(error,users){
            var total = 0;
            if(error){
              throw error;
            }
            else{
              var total = 0;

              for(var x = 0; x< users.length; x++)
              {
                total += users[x].stepsFromDateToDate(challenge.start,challenge.end);
              }

              var average = users.length >0 ? total/users.length : 0;
              var lastaverage = group.lastAverage ? group.lastAverage.steps : 0;
              data.averagesteps = average;
              data.totalsteps = total;
              data.lastaverage = lastaverage;
              group.lastLookedAt = {steps:total, date:new Date()};
              group.lastAverage = {steps:average, date: new Date()};
              group.save();

              geddy.model.Group.all({challengeId:challenge.id,not:{id:group.id}},function(error,othergroups){
                var others = [];
                for(var x = 0; x < othergroups.length; x++)
                {
                  var othersteps = othergroups[x].lastAverage ? othergroups[x].lastAverage.steps : 0;
                  others.push({group_id:othergroups[x].id,group_name:othergroups[x].name,lastaverage:othersteps});
                }
                data.othergroups = others;
                console.log(data);
                self.respond({data:data});
              });
            }
          });
        });
      }
    });
  };

};

exports.Groups = Groups;
