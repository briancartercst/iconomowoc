var stepmodel = require("../helpers/step.js")
var User = function () {

  this.defineProperties({
    name: {type: 'string', required: true},
    steps: {type: 'object'},
    lastLookedAt: {type:'object'}
  });

  this.hasMany('Groups', {through:'Groupusers'});
  this.autoIncrementId = true;

  this.totalSteps = function(){
  	var total = 0;
  	for(var x = 0; x< this.steps.length; x++)
  	{
  	  total += this.steps[x].steps;
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
      var step = new stepmodel(random,newdate);
      self.steps.push(step);
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
    for(var x = 0; x < this.steps.length; x++)
    {
      var stepday = this.steps[x].uploadDate.getTime();
      if(stepday >= from && stepday <= to)
      {
        steps += this.steps[x].steps;
        stepmodel()
      }
    }
    return steps;
  };
  

  this.stepsAfterDate = function(date)
  {
  	//date.setHours(0,0,0,0);
   	var today = date.getTime();
  	var steps = 0;
  	for(var x = 0; x < this.steps.length; x++)
  	{
  	  var stepday = this.steps[x].uploadDate.getTime();
  	  if(stepday >= today)
  	  {
  	    steps += this.steps[x].steps;
      }
  	}
    return steps;
  };


  this.stepsBeforeDate = function(date)
  {
  	//date.setHours(0,0,0,0);
   	var today = date.getTime();
  	var steps = 0;
  	for(var x = 0; x < this.steps.length; x++)
  	{
  	  var stepday = this.steps[x].uploadDate.getTime();
  	  if(stepday <= today)
  	  {
  	    steps += this.steps[x].steps;
      }
  	}
    return steps;
  };

  /*
  this.property('login', 'string', {required: true});
  this.property('password', 'string', {required: true});
  this.property('lastName', 'string');
  this.property('firstName', 'string');

  this.validatesPresent('login');
  this.validatesFormat('login', /[a-z]+/, {message: 'Subdivisions!'});
  this.validatesLength('login', {min: 3});
  // Use with the name of the other parameter to compare with
  this.validatesConfirmed('password', 'confirmPassword');
  // Use with any function that returns a Boolean
  this.validatesWithFunction('password', function (s) {
      return s.length > 0;
  });
  // Can define methods for instances like this
  this.someMethod = function () {
    // Do some stuff
  };
  */

};

/*
// Can also define them on the prototype
User.prototype.someOtherMethod = function () {
  // Do some other stuff
};
// Can also define static methods and properties
User.someStaticMethod = function () {
  // Do some other stuff
};
User.someStaticProperty = 'YYZ';
*/

User = geddy.model.register('User', User);
