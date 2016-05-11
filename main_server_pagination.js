var express = require('express');
var bodyParser = require('body-parser')
var app = express();


var mongoose = require('mongoose');
var URL = 'mongodb://localhost:27017/employeeDb'

mongoose.connect(URL, function () {
    console.log('Mongoose is connected.');
});

// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json, instruct server to receive json 
app.use(bodyParser.json());

var employeeSchema = mongoose.Schema({
    empid: String,
    firstName: String,
    middleName: String,
    lastName: String,
    designation: String,
    age: Number,
    salary: Number
});

var employee = mongoose.model('employee', employeeSchema, 'Employees');

app.get('/', function (req, res) {
  res.send('Hello World!');
});

//Get all employees
app.get('/employees', function (req, res) {
    var pageNumber = parseInt(req.param("currentPage"));
    var pageSize = parseInt(req.param("pageSize"));
    
    employee.find({}).skip((pageNumber-1)*pageSize).limit(pageSize).exec(function(err,response){
        if(response)
        {
            res.send(response);
        }
        else if(err)
            res.send(err);                                                                    
    });
});

//Get employee count
app.get('/employees/recordCount', function (req, res) {
    employee.count({}, function(err,response){
        if(response)
       {    
            var count = response;
            var param ={
                count : count,
                status: 200
            }
            
            res.send(param);
        }
        else if(err)
        {
            res.send(err);
        }
    }); 
});

app.get('/employee', function (req, res) {
    var employeeId = req.query.employeeId;
    employee.find({"empid" : employeeId},function(err,response){
        if(response)
            res.send(response);
        else if(err)
            res.send(err);
    })
});

app.post('/employee', function(req,res){
    dataObj = req.body;
    
    if(dataObj._id)
    {
        employee.findByIdAndUpdate(dataObj._id, dataObj, {new: true}, function(err,response){
            if(response)
                res.send(response);
            else if(err)
                res.send(err);
        });
    }
    else if(!dataObj._id)
    {
        var emp = new employee(dataObj);
        emp.save(function(err,response)
        {
            if(response)
            {
                console.log("Employee inserted successfully.");
                console.log(emp.empid);
                res.send(response);
            }
            else if(err)
                res.send(err);
            
        });
    }
});

app.delete('/employees', function (req, res) {
    console.log(req);
    var employeeId = req.param("employeeId");
    employee.remove({empid: employeeId}, function(err,response){
        if(response)
            res.send(response);
        else if(err)
            res.send(err);     
    });
});


app.listen(3000, function () {
  console.log('Employee App listening on port 3000!');
});