var passport = require('../helpers/passport')
  , cryptPass = passport.cryptPass
  , requireAuth = passport.requireAuth;
var Challenges = function () {
    this.before(requireAuth, {
  });
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.index = function (req, resp, params) {
    var self = this;
    var User = geddy.model.User;
    User.first({id: this.session.get('userId')}, function (err, user) {
      if (user) {
        user.getChallenges(function(err,challenges){
          if(challenges)
          {
            data.challenges = challenges;
          }
          self.respond(data);
        });

      }
    });
  };

  this.add = function (req, resp, params) {
    var self = this;
    var User = geddy.model.User;
    User.first({id: this.session.get('userId')}, function (err, user) {
      if (user) {
        self.respond({params: params,user:user});
      }
    });
  };

  this.create = function (req, resp, params) {
    var self = this
      , challenge = geddy.model.Challenge.create(params);

    if (!challenge.isValid()) {
      this.respondWith(challenge);
    }
    else {
      challenge.save(function(err, data) {
        if (err) {
          throw err;
        }
      });
        var User = geddy.model.User;
        User.first({id: this.session.get('userId')}, function (err, user) {
          if (user) {
            user.addChallenge(challenge);
            user.save();
          }
          self.redirect({controller:'challenges', action:'show', id:challenge.id})
        });
    }
  };

  this.show = function (req, resp, params) {
    var self = this;
    var User = geddy.model.User;
    User.first({id: this.session.get('userId')}, function (err, user) {
    if (user) {
      geddy.model.Challenge.first(params.id, function(err, challenge) {
        if (err) {
          throw err;
        }
        if (!challenge) {
          throw new geddy.errors.NotFoundError();
        }
        else {
          self.respond({challenge:challenge, user:user});
        }
      });
    }
    });
  };

  this.edit = function (req, resp, params) {
    var self = this;
    var User = geddy.model.User;
    User.first({id: this.session.get('userId')}, function (err, user) {
      if (user) {
        geddy.model.Challenge.first(params.id, function(err, challenge) {
          if (err) {
            throw err;
          }
          if (!challenge) {
            throw new geddy.errors.BadRequestError();
          }
          else {
            self.respond({challenge:challenge,user:user});
          }
        });
      }
    });
  };

  this.update = function (req, resp, params) {
    var self = this;

    geddy.model.Challenge.first(params.id, function(err, challenge) {
      if (err) {
        throw err;
      }
      challenge.updateProperties(params);

      if (!challenge.isValid()) {
        self.respondWith(challenge);
      }
      else {
        challenge.save(function(err, data) {
          if (err) {
            throw err;
          }
          self.respondWith(challenge, {status: err});
        });
      }
    });
  };

  this.remove = function (req, resp, params) {
    var self = this;

    geddy.model.Challenge.first(params.id, function(err, challenge) {
      if (err) {
        throw err;
      }
      if (!challenge) {
        throw new geddy.errors.BadRequestError();
      }
      else {
        geddy.model.Challenge.remove(params.id, function(err) {
          if (err) {
            throw err;
          }
          self.respondWith(challenge);
        });
      }
    });
  };

};

exports.Challenges = Challenges;
