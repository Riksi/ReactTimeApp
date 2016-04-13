var mongoose = require('mongoose');

var Activity = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  recorded: {
    type: Number,
    default: 0
  },  
  deadline: {
    type: Date,
    default: new Date('31 December 2017'),
  },
  target: {
    type: Number,
    required: true,
    min: 0,
    max: 359999
  },
  achieved: {
    type: Number,
    default: 0,
    min: 0,
    max: 359999
  },
  complete: {
    type: Boolean,
    default: false
  }
});

var MONTHS = ['Jan',
              'Feb',
              'Mar',
              'Apr',
              'May',
              'Jun',
              'Jul',
              'Aug',
              'Sep',
              'Oct',
              'Nov',
              'Dec']

Activity.virtual('year').get(function(){
  if(this.deadline){
    return this.deadline.getFullYear();
  }
});

Activity.virtual('month').get(function(){
  if(this.deadline){
    return MONTHS[this.deadline.getMonth()];
  }
});

Activity.virtual('day').get(function(){
  if(this.deadline){
    return this.deadline.getDate();
  }
});

var secondsToHMS = function(t){
  var hours = Math.floor(t/3600);
  var minutes = Math.floor((t - hours*3600)/60);
  var seconds = t - hours*3600  - minutes*60;
  return{
    hours: hours,
    minutes: minutes,
    seconds: seconds
  }
};

Activity.virtual('hours').get(function(){
  return secondsToHMS(this.target).hours
});

Activity.virtual('minutes').get(function(){
  return secondsToHMS(this.target).minutes
});

Activity.virtual('seconds').get(function(){
  return secondsToHMS(this.target).seconds
});

Activity.virtual('aHours').get(function(){
  return secondsToHMS(this.achieved).hours
});

Activity.virtual('aMinutes').get(function(){
  return secondsToHMS(this.achieved).minutes
});

Activity.virtual('aSeconds').get(function(){
  return secondsToHMS(this.achieved).seconds
});

Activity.virtual('percentComplete').get(function(){
  return 100*this.achieved/this.target
});

Activity.set('toObject',{virtuals: true})

Activity.set('toJSON',{virtuals: true})

module.exports = Activity