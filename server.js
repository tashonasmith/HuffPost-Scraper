var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/huffpostscraper", { useNewUrlParser: true });

app.get("/scrape", function(req, res) {
    axios.get("https://www.huffpost.com/").then(function(response) {
      var $ = cheerio.load(response.data);
  
      $("div.card__headlines").each(function(i, element) {
        // Save an empty result object
        var result = {};
  
        result.title = $(this)
          .find("h3")
          .text();
        result.link = $(this)
          .children("a")
          .attr("href");

        db.Article.create(result)
        .then(function(dbArticle) {
          console.log(dbArticle);
        })
        .catch(function(err) {
          console.log(err);
        });
      });
      
    //   var entry = new Article(result);

    //   entry.save(function(err, res) {
    //     if (err) {
    //       console.log(err);
    //     }
    //     else {
    //       console.log(res);
    //     }
    //   });
  
      // Send a message to the client
      res.send("Scrape Complete");
      console.log("Scrape Complete");
    });
});

app.get("/articles", function(req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
      .then(function(dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
});


  
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
  });
  
