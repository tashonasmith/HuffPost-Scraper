var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    title: {
      type: String,
      required: true
    },
    link: {
      type: String,
      required: true
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: "comment"
    },
    saved: {
      type: Boolean,
      default: false
    }
  });
  
  var Article = mongoose.model("Article", ArticleSchema);
  
  module.exports = Article;
  