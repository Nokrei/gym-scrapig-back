// Import the express library in this file
const express = require("express");
// Assign to server the express library
const server = express();

server.set("view engine", "ejs");

// Import cors
const cors = require('cors');

// Import dotenv
const dotenv = require("dotenv");
dotenv.config();

// Import Product model
const ProductModel = require("./models/ProductModel");

// Import body-parser
const bodyParser = require("body-parser");

// Import axios, cheerio and puppeteer
const axios = require("axios");
const cheerio = require("cheerio");

// Import express-form-data
const expressFormData = require("express-form-data");

// Import mongoose
const mongoose = require("mongoose");
const ProductRoutes = require("./routes/ProductRoutes");

const dbURL = process.env.DB_URL;

mongoose
  .connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })

  .then(() => {
    console.log("Connected to MongoDB");
  })

  .catch((e) => {
    console.log("an error occured", e);
  });

server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(cors());
server.use(expressFormData.parse());

// Delete all entries in products collection

ProductModel.deleteMany({ price: { $gte: 1 } })
  .then(() => {
    console.log("Data deleted");
  })
  .catch((error) => {
    console.log(error);
  });

// Gym names array
const gyms = ["https://fitness101.com/membership","https://whgym.com/package/regular/",
"https://iconicfitness.ae/about/rates/","https://goldsgym.ae/2021-offer/" ]

// Use Axios to get HTTP request
axios
  .get(gyms[0])
  .then((response) => {
    const html = response.data;

    // Load response data to a Cheerio instance
    const $ = cheerio.load(html);

    // Use Cheerio selectors syntax to search for the elements containing desired data
    const scrapeData = $("h3", ".col-xs-12 div").text().split(" ");

    // Extract lowest number from data received
    const scrapedData = scrapeData
      .map((item) => {
        return parseInt(item);
      })
      .filter((item) => item > 1)
      .sort((a, b) => a - b);

    // Save new data to DB
    const formData = {
      name: gyms[0],
      price: scrapedData[0],
    };
    const newProduct = new ProductModel(formData);

    newProduct.save();
  })
  .catch((error) => {
    console.log(error);
  });
// Use Axios to get HTTP request
axios
  .get(gyms[1])
  .then((response) => {
    const html = response.data;

    // Load response data to a Cheerio instance
    const $ = cheerio.load(html);

    // Use Cheerio selectors syntax to search for the elements containing desired data
    const scrapeData = $("h2", ".stripe-wrap div ").text().split(" ");

    // Extract lowest number from data received
    const scrapedData = scrapeData
      .map((item) => {
        return parseInt(item);
      })
      .filter((item) => item > 12)
      .sort((a, b) => a - b);

    // Save new data to DB
    const formData = {
      name: gyms[1],
      price: scrapedData[0],
    };
    const newProduct = new ProductModel(formData);

    newProduct.save();
  })
  .catch((error) => {
    console.log(error);
  });
// Use Axios to get HTTP request
axios
  .get(gyms[2])
  .then((response) => {
    const html = response.data;

    // Load response data to a Cheerio instance
    const $ = cheerio.load(html);

    // Use Cheerio selectors syntax to search for the elements containing desired data
    const scrapeData = $("h2", ".vc_row div").text().split(" ");

    // Extract lowest number from data received
    const scrapedData = scrapeData
      .map((item) => {
        return parseInt(item);
      })
      .filter((item) => item > 1)
      .sort((a, b) => a - b);

    // Save new data to DB
    const formData = {
      name: gyms[2],
      price: scrapedData[0],
    };
    const newProduct = new ProductModel(formData);

    newProduct.save();
  })
  .catch((error) => {
    console.log(error);
  });
  axios
  .get(gyms[3])
  .then((response) => {
    const html = response.data;

    // Load response data to a Cheerio instance
    const $ = cheerio.load(html);

    // Use Cheerio selectors syntax to search for the elements containing desired data
    const scrapeData = $("p", ".so-panel div ").text().split(" ");

    // Extract lowest number from data received
    const scrapedData = scrapeData
      .map((item) => {
        return parseInt(item);
      })
      .filter((item) => item > 100 && item < 1000)
      .sort((a, b) => a - b);

    // Save new data to DB
    const formData = {
      name: gyms[3],
      price: scrapedData[0],
    };
    const newProduct = new ProductModel(formData);

    newProduct.save();
  })
  .catch((error) => {
    console.log(error);
  });
server.get(
  //1st argument
  "/",
  //2nd argument
  (req, res) => {
    const theHTML = "<h1>Welcome to My App</h1>";
    res.send(theHTML);
  }
);

server.use("/products", ProductRoutes);

server.get("/404", (req, res) => {
  res.send("<h1>404<h1>");
});

server.get("*", (req, res) => {
  res.redirect("/404");
});

server.listen(
  // port number
  process.env.PORT || 3000,
  // callback when (and if) the connection is OK
  () => {
    console.log("Your server is now running http://localhost:3000/");
  }
);
