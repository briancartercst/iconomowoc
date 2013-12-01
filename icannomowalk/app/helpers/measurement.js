function MeasurementModel(deviceId,steps,date){
  this.deviceId = deviceId;
  this.steps = steps;
  this.uploadDate = date;
  this.createdAt = new Date();
};

module.exports=MeasurementModel;
