const mongoose = require("mongoose");

const Book = mongoose.model("Book", {
  title: String,
  author: String,
  dateAdded: Date,
  dateDue: Date,
  rate: Number,
  status: Number,
});

module.exports = Book;
