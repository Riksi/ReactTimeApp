var mongoose = require('mongoose');

var Day = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  activityId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Activity'
  },
  achieved:{
    type: Number,
    required: true,
    default: 0,
    min: 0,
    max: 86400
  }

});

Day.virtual('dateString').get(function(){
  console.log(this.date.toDateString());
  return this.date.toDateString();
})

module.exports = Day;

/*
  activity_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Activity'
    },
    time: {
      type: Number,
      default: 0
    }
  }]*/