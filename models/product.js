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
