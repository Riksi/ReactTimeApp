var mongoose_handlers = require("./mongoose_handlers.js")
var path = require('path');
var express = require('express');
var app = express();
var htmlString = 
'<form method = post action = \'/add\'><input type = text name = name><input type = text name = target><input type = \'submit\' value = Add></form><form method = post action = \'/delete\'><input type = \'submit\' value = Delete></form><form action = \'/read\'><input type = \'submit\' value = Read></form><form method = post action = \'/update\'><input type = text name = target><input type = \'submit\' value = Update></form>'

var editForm = '<form method = post action = \'/edit\'><label> Name: <input type = \'text\' name = name></label><label>Achieved: <input type="number" name="quantity" min="1" max="5"></label><input type = \'submit\' value = Edit></form>'
var app = require('express')();
var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Calls read and shows ongoing tasks
app.get('/', function (req, res) {
   res.sendFile(path.resolve("C:/Users/Anush/EECS/React/public/index.html"));
})


// Called when you 
app.post('/add', function(req,res){
	mongoose_handlers.add({
	  name: req.body.name,
	  target: req.body.target,
	  deadline: new Date(req.body.deadline)
	},res);
	//res.redirect('/');
});

//Both the main page and the detail page call this 
app.get('/read', function(req,res){
	mongoose_handlers.readAll(res);
	//res.json(acts);
});


//Called when you delete a task
app.post('/delete', function(req,res){
	mongoose_handlers.del(req.body._id,res);
});

//Called when you edit attributes, increment time, finish
app.post('/edit', function(req,res){
	//console.log(req.body._id)
	//console.log(req.body.params)
	mongoose_handlers.edit(req.body._id,req.body.params,res);
});


app.post('/update', function(req,res){
	//need a way to link the id of the 
	mongoose_handlers.update(req.body.id,{target:req.body.inc});
	res.redirect('/');
});
// Gets details of tasks in a particular category
app.get('/detail', function(req,res){
	res.send('Details ');
})

app.listen(8080);
