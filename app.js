// *********************************************************************************
// 	ITE5315 – Assignment 4
// *	I declare that this assignment is my own work in accordance with Humber Academic Policy.
// *  No part of this assignment has been copied manually or electronically from any other source
// *  (including web sites) or distributed to other students.
// *
// *	Name: Kovid Behl      Student ID: N01579154        Date: 2024-3-26
// *
// *
// ********************************************************************************
var express = require("express");
var mongoose = require("mongoose");
var app = express();
const exphbs = require("express-handlebars");
var database = require("./config/database");
var bodyParser = require("body-parser");
mongoose.set("strictQuery", false); // pull information from HTML POST (express4)


var port = process.env.PORT || 8000;
app.use(bodyParser.urlencoded({ extended: "true" })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: "application/vnd.api+json" })); // parse application/vnd.api+json as json

mongoose.connect(database.url);

// Import Product model
var Product = require("./models/product.js");

// Set up handlebars as the view engine
app.engine(
    ".hbs",
    exphbs.engine({
        extname: ".hbs",
        helpers: {
            noReviews: function (reviews) {
                return reviews !== "" ? reviews : "N/A";
            },
        },
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true,
          },
    })
);
app.set("view engine", ".hbs");

// Get all products from db
app.get("/api/product", function (req, res) {
    // Use mongoose to get all products in the database
    Product.find(function (err, products) {
        // If there is an error retrieving, send the error; otherwise, send data
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(products); // Return all products in JSON format
        }
    });
});

// Get a product by ID
app.get("/api/product/:product_id", function (req, res) {
    let id = req.params.product_id;
    Product.findById(id, function (err, products) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(products);
        }
    });
});

// Create a product and send back all products after creation
app.post("/api/product", function (req, res) {
    // Create mongoose method to create a new record into collection
    console.log(req.body);

    Product.create(
        {
            id: req.body.id,
            asin: req.body.asin,
            title: req.body.title,
            imgUrl: req.body.imgUrl,
            stars: req.body.stars,
            reviews: req.body.reviews,
            price: req.body.price,
            listPrice: req.body.listPrice,
            categoryName: req.body.categoryName,
            isBestSeller: req.body.isBestSeller,
            boughtInLastMonth: req.body.boughtInLastMonth,
        },
        function (err, newProduct) {
            if (err) {
                res.status(500).send(err);
            } else {
                // Get and return all the products after newly created product record
                Product.find(function (err, products) {
                    if (err) {
                        res.status(500).send(err);
                    } else {
                        res.json(products);
                    }
                });
            }
        }
    );
});

// Delete a product by id
app.delete("/api/product/:product_id", function (req, res) {
    console.log(req.params.product_id);
    let id = req.params.product_id;
    Product.remove(
        {
            _id: id,
        },
        function (err) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.send("Successfully! Product has been Deleted.");
            }
        }
    );
});



// Update a product by ID or ASIN
app.put("/api/product/:id", function (req, res) {
    let id = req.params.id;
    let newData = {
        title: req.body.title,
        price: req.body.price,
    };

    // Use findOneAndUpdate to update the product based on ID or ASIN
    Product.findOneAndUpdate(
        { _id: id },
        newData,
        { new: true },
        function (err, updatedProduct) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.json(updatedProduct);
            }
        }
    );
});


// Route to render the all data from product
app.get("/api/allData", async(req, res) => {
    try {
        // Use Mongoose to find all products from the database
        const products = await Product.find();
        res.render("allData", { title: "Product List", products: products });
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/api/new-product", (req, res) => {
    res.render("insertNew", { title: "Add New Product" });
  });
  app.post("/api/product", async (req, res) => {
    try {
      const {
        asin,
        title,
        imgUrl,
        stars,
        reviews,
        price,
        listPrice,
        categoryName,
        boughtInLastMonth,
      } = req.body;
  
      // Create a new product object
      const newProduct = new Product({
        asin,
        title,
        imgUrl,
        stars,
        reviews,
        price,
        listPrice,
        categoryName,
        boughtInLastMonth,
      });
  
      // Save the new product to the database
      await newProduct.save();
  
      res.redirect("/"); // Redirect to homepage or product list page
    } catch (error) {
      res.status(500).send("Error adding product: " + error.message);
    }
  });
app.listen(port);
console.log("App listening on port : " + port);
