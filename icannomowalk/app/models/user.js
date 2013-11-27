var measurement = require("../helpers/measurement.js");  
var User = function () {
  this.defineProperties({
    username: {type: 'string', required: true},
    password: {type: 'string', required: true},
    familyName: {type: 'string', required: true},
    givenName: {type: 'string', required: true},
    email: {type: 'string', required: true},
    measurements: {type: 'object'},
    devices:{type:'object'},
    lastLookedAt: {type:'object'},
    goals: {type:'object'},
    friends: {type:'object'}
  });

  this.validatesLength('username', {min: 3});
  this.validatesLength('password', {min: 8});
  this.validatesConfirmed('password', 'confirmPassword');

  this.hasMany('Passports');
  this.hasMany('Groups', {through:'Groupusers'});
  this.hasMany('Challenges', {through:'Challengeusers'});
  this.autoIncrementId = true;

  this.totalSteps = function(){
    var total = 0;
    for(var x = 0; x< this.measurements.length; x++)
    {
      total += this.measurements[x].steps;
    }
    return total;
  };
  
  this.addSteps = function(fromDate, toDate){
    var self = this;
    var steps = [];
    fromDate.setHours(0,0,0,0);
    toDate.setHours(0,0,0,0);
    while(fromDate.getTime() <= toDate.getTime())
    {
      var random = Math.floor((Math.random()*10000)+5000);
      var newdate = new Date(fromDate);
      var step = new measurement(12345,random,newdate);
      self.measurements.push(step);
      fromDate.setDate(fromDate.getDate()+1);
    }
    self.save();
  }


  this.stepsFromDateToDate = function (fromDate, toDate)
  {
    //fromDate.setHours(0,0,0,0);
    //toDate.setHours(0,0,0,0);
    var from = fromDate.getTime();
    var to = toDate.getTime();
    var steps = 0;
    for(var x = 0; x < this.measurements.length; x++)
    {
      var stepday = this.measurements[x].uploadDate.getTime();
      if(stepday >= from && stepday <= to)
      {
        total += this.measurements[x].steps;
      }
    }
    return steps;
  };
  

  this.stepsAfterDate = function(date)
  {
    //date.setHours(0,0,0,0);
    var today = date.getTime();
    var steps = 0;
    for(var x = 0; x < this.measurements.length; x++)
    {
      var stepday = this.measurements[x].uploadDate.getTime();
      if(stepday >= today)
      {
        total += this.measurements[x].steps;
      }
    }
    return steps;
  };


  this.stepsBeforeDate = function(date)
  {
    //date.setHours(0,0,0,0);
    var today = date.getTime();
    var steps = 0;
    for(var x = 0; x < this.measurements.length; x++)
    {
      var stepday = this.measurements[x].uploadDate.getTime();
      if(stepday <= today)
      {
        steps += this.measurements[x].steps;
      }
    }
    return steps;
  };

};

User = geddy.model.register('User', User);


