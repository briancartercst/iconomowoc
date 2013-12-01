var Adminchallenges = function () {
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.index = function (req, resp, params) {
    var self = this;

    geddy.model.Challenge.all(function(err, challenges) {
      self.respondWith(challenges, {type:'Challenge'});
    });
  };

  this.add = function (req, resp, params) {
    this.respond({params: params});
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
        self.respondWith(challenge, {status: err});
      });
    }
  };

  this.show = function (req, resp, params) {
    var self = this;

    geddy.model.Challenge.first(params.id, function(err, challenge) {
      if (err) {
        throw err;
      }
      if (!challenge) {
        throw new geddy.errors.NotFoundError();
      }
      else {
        self.respondWith(challenge);
      }
    });
  };

  this.edit = function (req, resp, params) {
    var self = this;

    geddy.model.Challenge.first(params.id, function(err, challenge) {
      if (err) {
        throw err;
      }
      if (!challenge) {
        throw new geddy.errors.BadRequestError();
      }
      else {
        self.respondWith(challenge);
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

exports.Adminchallenges = Adminchallenges;
