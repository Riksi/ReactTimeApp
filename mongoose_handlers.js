var mongoose = require('mongoose');
var schema = require('./schema');

mongoose.connect('mongodb://localhost:27017/discrete_time_test');

// Parameters are: model name, schema, collection name
var Activity = mongoose.model('Activity', schema, 'activity');

/*var act = new Activity({
  name: 'Machine Learning',
  target: 50,
});*/

/*Activity.virtual('hms').get(function(){
  var fullSeconds = this.target;
  var hours = Math.floor(this.target/3600);
  var minutes = Math.floor(fullSeconds - hours*3600)/60;
  var seconds = fullSeconds - hours*3600  - minutes*60;
  return{
    hours: hours,
    minutes: minutes,
    seconds: seconds
  }
});*/



var add = function(params,res){

  var act = new Activity(params);
  act.save(function(error, saved) {
    if (error) {
      res.json(error);
    }
    else
      {readAll(res)};
  });
};

var read = function(params,res){
    Activity.findById(id,params,function(err,act){
    if(err){res.json(err);}
    else{ 
      res.json(act);}
  })
}

var readAll = function(res){
  Activity.find({},function(err,found){
    if(err){res.json(err);}
    else{ 
      res.json(found);}
  })
}

var del = function(id,res){
      Activity.findByIdAndRemove(id,function(err,act){
      if (err){
        res.json(err);
      }
      else{readAll(res)};
    })
}

var edit = function(id,params,res){
  Activity.findByIdAndUpdate(id,{$set: params},function(err,result){
    if(err){res.json(err);}
    else{ 
      //for the moment returns all the data
      readAll(res);}
  })
}

var update = function(id,params){
    Activity.findByIdAndUpdate(id,{$inc: params},function(err,result){
    if(err){console.log(err)};
    console.log(result);
  })
}
module.exports = {add: add, 
                  read: read, 
                  del:del, 
                  edit:edit, 
                  update:update,
                  readAll: readAll};