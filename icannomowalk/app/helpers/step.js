function StepModel(steps,date){
  this.steps = steps;
  this.uploadDate = date;
  this.createdAt = new Date();
};

module.exports=StepModel;
