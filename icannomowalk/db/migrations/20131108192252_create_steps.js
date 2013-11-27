var CreateSteps = function () {
  this.up = function (next) {
    var def = function (t) {
          t.column('steps', 'int');
          t.column('date', 'date');
        }
      , callback = function (err, data) {
          if (err) {
            throw err;
          }
          else {
            next();
          }
        };
    this.createTable('step', def, callback);
  };

  this.down = function (next) {
    var callback = function (err, data) {
          if (err) {
            throw err;
          }
          else {
            next();
          }
        };
    this.dropTable('step', callback);
  };
};

exports.CreateSteps = CreateSteps;
