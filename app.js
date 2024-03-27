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
    ".hbs",exphbs.engine({
        extname: ".hbs",
        helpers: {
            noReviews: function (reviews) {
                return reviews !== "" ? reviews : "N/A";
            },
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

// Route to render the update product form
app.get("/update-product", (req, res) => {
    res.render("update_product", { title: "Update Product" });
});

// Route to handle form submission and update the product
app.post('/update-product', async (req, res) => {
    const { productId, title, price, isBestSeller } = req.body;

    try {
        // Find the product by either _id or asin
        const product = await Product.findOne({ asin: productId });

        if (!product) {
            return res.status(404).send('Product not found');
        }

        // Convert isBestSeller to a Boolean value
        const isBestSellerBool = isBestSeller === 'true'; // Convert 'true' string to true, 'false' string to false

        // Update the product's title, price, and isBestSeller
        product.title = title;
        product.price = price;
        product.isBestSeller = isBestSellerBool;
        await product.save();

        res.status(200).send('Product updated successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});





app.listen(port);
console.log("App listening on port : " + port);
