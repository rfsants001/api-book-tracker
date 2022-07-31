const mongoose = require("mongoose");

const User = mongoose.model("User", {
  userName: String,
  email: String,
  password: String,
  book: [
    {
      title: String,
      author: String,
      dateAdded: Date,
      dateDue: Date,
      rate: Number,
      status: Number,
    },
  ],
});

module.exports = User;
