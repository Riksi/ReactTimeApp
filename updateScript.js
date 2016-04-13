var mongoose = require('mongoose');
var schema = require('./schema');
var daySchema = require('./daySchema');

mongoose.connect('mongodb://localhost:27017/discrete_time_test');

// Parameters are: model name, schema, collection name
var Activity = mongoose.model('Activity', schema, 'activity');
var Day = mongoose.model('Day', daySchema, 'day');
var dateStrings = [1,2,3,4,5,6,7,8].map(function(day){
	return new Date(2016,3,day);
})

Activity.find({},function(err,found){
	if(err){console.log(err);}
	else{
		var acts = found.map(function(act){
			return({
				activity_id: act._id,
				achieved: act.achieved/8.0
			})
		});
		dateStrings.forEach(function(day){
			acts.forEach(function(a){
				a["date"] = day;
				var dayAct = new Day(a);
				dayAct.save(function(err){
					console.log(err);
					
					})
				})
			})
		}
	})