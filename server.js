// Import the express library in this file
const express = require("express");
// Assign to server the express library
const server = express();

server.set("view engine", "ejs");

// Import dotenv
const dotenv = require("dotenv");
dotenv.config();

// Import axios, cheerio and puppeteer
const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");

// Import mongoose 
const mongoose = require("mongoose");
const ProductModels = require("./routes/ProductRoutes");

const dbURL = process.env.DB_URL;

mongoose
  .connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })

  .then(() => {
    console.log("Connected to MongoDB");
  })

  .catch((e) => {
    console.log("an error occured", e);
  });

// Use Axios to get HTTP request
axios
  .get("https://fitness101.com/membership")
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

    // Output scraped data
    console.log(scrapedData[0]);
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
