var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var bodyParser = require('body-parser');
var exphbs  = require('express-handlebars');
var path = require("path");

//const express = require('express');
// const Handlebars = require('handlebars')
// const expressHandlebars = require('express-handlebars');
// const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')


var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();
app.engine('handlebars', exphbs({ defaultLayout: "main"}), /*expressHandlebars({
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})*/);
app.set('view engine', 'handlebars');


// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true}));
// Make public a static folder
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/huffpostscraper", { useNewUrlParser: true });

//GET route to retrieve index page
app.get("/", function(req, res) {
    db.Article.find({"saved": false}, function(err, articles) {
      var articleObject = {
        article: articles
      };
      if (err) {
        console.log(err)
      }
      console.log(articleObject);
      res.render("index", articleObject);
    }).lean();
});

//GET route to retrieve saved page
app.get("/saved", function(req, res) {
    db.Article.find({"saved": true}, function(err, articles) {
        var articleObject = {
            article: articles
          };
          if (err) {
            console.log(err)
          }
          console.log(articleObject)
          res.render("saved", articleObject); 
    }).lean()
});
  
  

//GET route for scraping from HuffPost
app.get("/scrape", function(req, res) {
    axios.get("https://www.huffpost.com/").then(function(response) {
      var $ = cheerio.load(response.data);
      $("div.card__headlines").each(function(i, element) {
        
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

//GET route for retrieving all articles from db
app.get("/articles", function(req, res) {
    db.Article.find({}).lean()
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
});

//GET route for retrieving a specific article by id, then populating the response object with its corresponding note
app.get("/articles/:id", function(req, res) {
    db.Article.findOne({ _id: req.params.id }).lean()
    .populate("Comment")
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    })
});

// Find an article by id, updated saved boolean
app.post("/articles/saved/:id", function(req, res) {
    db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: true}).lean()
    .then(function(dbArticle) {
      res.json(dbArticle);
      console.log("article saved")
    });
});

//Retrieve all saved articles
app.get("/articles/saved", function(req, res) {
    db.Article.find({ saved: true }).lean()
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    })
});

//Route for saving/updating an Article's associated Comment
app.post("articles/:id", function(req, res) {
    db.Comment.create(req.body)
      .then(function(dbComment) {
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { Comment: dbComment._id}, {new: true});
      })
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      })
});


//Route for deleting Article by id
app.delete("/articles/delete/:id", function(req, res) {
    db.Article.findOneAndDelete({ _id: req.params.id }).lean()
    .then(function(dbArticle) {
      console.log("Article Deleted")
      res.json(dbArticle)
    })
    .catch(function(err) {
      res.json(err);
    });
})

//Route for clearing all scraped articles
app.delete("/articles/delete", function(req, res) {
    db.Article.deleteMany({}, function(res, err) {
        if (err) {
          console.log(err)
        }
        else {
          res.send("All articles cleared")
          console.log("All articles deleted")
        }
    }).lean()
})

//Route for getting all Comments
app.get("/comments", function(req, res) {
    db.Comment.find({}).lean()
      .then(function(dbComment) {
        res.json(dbComment);
      })
      .catch(function(err) {
        res.json(err);
      })
});

//Route for deleting comment by id
app.delete("/comments/delete/:id", function(req, res) {
    db.Comment.findOneAndDelete({ _id: req.params.id })
    .then(function(dbComment) {
      console.log("Comment Deleted")
      res.json(dbComment)
    })
    .catch(function(err) {
      res.json(err);
    });
})

app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
  });
  
