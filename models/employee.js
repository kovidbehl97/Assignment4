/********************************************************************************* 
*	ITE5315 – Assignment 4 
*	I declare that this assignment is my own work in accordance with Humber Academic Policy.   
*  No part of this assignment has been copied manually or electronically from any other source 
*  (including web sites) or distributed to other students. 
*  
*	Name: Kovid Behl      Student ID: N01579154        Date: 2024-3-26 
* 
* 
********************************************************************************/ 
// load mongoose since we need it to define a model
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
EmpSchema = new Schema({
    name: String,
    salary: Number,
    age: Number,
});
module.exports = mongoose.model("Employee", EmpSchema);
