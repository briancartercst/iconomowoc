var assert = require('assert')
  , tests
  , Challenge = geddy.model.Challenge;

tests = {

  'after': function (next) {
    // cleanup DB
    Challenge.remove({}, function (err, data) {
      if (err) { throw err; }
      next();
    });
  }

, 'simple test if the model saves without a error': function (next) {
    var challenge = Challenge.create({});
    challenge.save(function (err, data) {
      assert.equal(err, null);
      next();
    });
  }

, 'test stub, replace with your own passing test': function () {
    assert.equal(true, false);
  }

};

module.exports = tests;
