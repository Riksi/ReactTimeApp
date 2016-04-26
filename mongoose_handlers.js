//Modify so that achieved is something that
//alters only through incrementation - it should no
//longer be part of the form
//Reason for this is that now daily
//records will be maintained



//Need to modify so that achieved hours only stored in the Day object
//When you increment time, this is stored in the Day object
//The achieved item is calculated by aggregating the Day objects 


var port = process.env.PORT || 8080;

var mongoose = require('mongoose');
var schema = require('./schema');
var daySchema = require('./daySchema');
var uri_local = 'mongodb://localhost:27017/discrete_time_test'
var uri = 'mongodb://heroku_r0fx58jg:enmu8irpaifffuip306dkcrmgf@ds013991.mlab.com:13991/heroku_r0fx58jg'
mongoose.connect((port == 8080)?uri_local:uri);

// Parameters are: model name, schema, collection name
var Activity = mongoose.model('Activity', schema, 'activity');
var Day = mongoose.model('Day', daySchema, 'day');
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

//Find out how to add relative validation - how would this 
//work if you are updating both field
//Basic possibility - if both exist, then run two updates
//with target first; alternatively run comparison before
//updating if both exist

var add = function(params,res){
  console.log(params.deadline);
  var act = new Activity(params);
  act.save(function(error, saved) {
    if (error) {
      res.json(error);
    }
    else
      { Activity.find(params,function(err,found){
        console.log(found);
      })
        readAll(res)

      };
  });
};

var read = function(id){
    Activity.findById(id,function(err,act){
    if(err){console.log(err);}
    else{ 
      console.log(act);
    }
  })
}


var readAcross = function(res){
  Activity.find({},function(err,found){
    if(err){res.json(err);}
    else{
              found.forEach(function(act){
                Day.aggregate(
                  [ {$match: {activityId:act._id}},
                    {$group:{_id:null,achieved: {$sum: "$achieved"}}}
                  ]
                  ).exec(function(e,f){
                    if(e){act['achieved'] = null}
                    else{act['achieved'] = f.length?f[0].achieved:0;}
                })
            })
            res.json(found);
        }
    })
  }

var readAll = function(res){
  Activity.find({},function(err,found){
    if(err){res.json(err);}
    else{ 

      res.json(found);


    }
  })
}


/*var readAll = function(res){
  Activity.find({},function(err,found){
    if(err){res.json(err);}
    else{ 
      found.map(function)
    }
  })
}*/




var cmp = function(id,complete,res){
  Activity.findById(id,function(err,act){
    if(err){res.json(err);}
    else{
      //the recorded field simply backs up the data when you
      //mark complete without actually adding the hours
      //-in case you want to return to the previous state
      var rcdData = complete?act.achieved:0;
      var acdData = complete?act.target:act.recorded;
      edit(id,{recorded: rcdData, achieved: acdData, complete: complete == true},res);
    }
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
  console.log(Number(params.achieved) > Number(params.target))
  //Number(undefined) > anything evaluates to false
  // so don't need to ensure this field has been defined
  if(Number(params.achieved) > Number(params.target)){
    res.json({message: "Please enter a valid value"});
  }
  else{
    Activity.findByIdAndUpdate(id,{$set: params},
      { runValidators: true },
      function(err,result){
      if(err){res.json(err);}
      else{ 
        read(id);
        readAll(res);
      }
    })
  }
}

var update = function(id,params,res){
  var thisDate = new Date(Date.now());
    var upsertData = {
      $set: {date: thisDate,
              activity_id: id},
      $inc: params
    }
  var lowerDate = new Date(thisDate.toDateString())
  var upperDate = new Date(lowerDate);
  upperDate.setHours(24);

    Activity.findByIdAndUpdate(id,{$inc: params},function(err,result){
    if(err){res.json(err);}
    else{ 
      read(id);
      Day.update({activityId: id, date: {$gte: lowerDate, $lt: upperDate} },
        upsertData,{upsert: true, multi: true},function(err, result){
          if(err){
            res.json(err)
          }
          else{
            console.log(result);
            readAll(res);
          }
      });
    }
  })
}
 


var readDate = function(res){
  var lowerDate = new Date((new Date("19 May 2016")).toDateString())
  var upperDate = new Date(lowerDate);
  upperDate.setHours(24);
  /*Activity.update({deadline: {$gte: lowerDate, $lt: upperDate} },{$set:{deadline:upperDate}},{multi: true},function(err, result){
    err?res.json(err):res.json(result);
  });
  Activity.find({deadline: {$gte: lowerDate, $lt: upperDate} },function(err, result){
    err?res.json(err):res.json(result);
  });*/
}
module.exports = {add: add, 
                  read: read,
                  cmp: cmp, 
                  del:del, 
                  edit:edit, 
                  update:update,
                  readAll: readAll,
                  readAcross: readAcross,
                  readDate: readDate};