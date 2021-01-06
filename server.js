// Import the express library in this file
const express = require("express");
// Assign to server the express library
const server = express();

server.set("view engine", "ejs");

// Import cors
const cors = require("cors");

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

// Gym names and tags array
const gyms = [
  {
    link: "https://fitness101.com/membership",
    tagOne: "h3",
    tagTwo: ".col-xs-12 div",
  },
  {
    link: "https://whgym.com/package/regular/",
    tagOne: "h2",
    tagTwo: ".stripe-wrap div ",
  },
  {
    link: "https://iconicfitness.ae/about/rates/",
    tagOne: "h2",
    tagTwo: ".vc_row div",
  },
  {
    link: "https://goldsgym.ae/2021-offer/",
    tagOne: "p",
    tagTwo: ".so-panel div ",
  },
  {
    link: "https://fitnessfoundersdxb.com/index.php/about/",
    tagOne: "h2",
    tagTwo: ".elementor-element-87d4e4a div ",
  },
];

// Create a function accepting two parameters - gym site adress (gym) and tags for price (params)
const getGymData = (gym, params) => {
  // Use Axios to get HTTP request
  axios
    .get(gym)
    .then((response) => {
      const html = response.data;

      // Load response data to a Cheerio instance
      const $ = cheerio.load(html);

      // Use Cheerio selectors syntax to search for the elements containing desired data
      const scrapeData = $(params).text().split(" ");

      // Extract lowest number from data received
      const scrapedData = scrapeData
        .map((item) => {
          return parseInt(item);
        })
        .filter((item) => item > 101)
        .sort((a, b) => a - b);

      // Save new data to DB
      const formData = {
        name: gym,
        price: scrapedData[0],
      };
      const newProduct = new ProductModel(formData);

      newProduct.save();
    })
    .catch((error) => {
      console.log(error);
    });
};

//Invoke the getGymData function for each site
gyms.map((gym) => {
  return getGymData(gym.link, gym.tagOne, gym.tagTwo);
});

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
