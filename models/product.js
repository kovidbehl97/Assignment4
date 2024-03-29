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
productSchema = new Schema({
    id: String,
    asin:  String,
    title:  String,
    imgUrl:  String,
    stars:  Number,
    reviews:  Number,
    price:  Number,
    listPrice:  Number,
    categoryName:  String,
    isBestSeller: { type: Boolean, default: false },
    boughtInLastMonth: Number
}); 
module.exports = mongoose.model("product", productSchema);
