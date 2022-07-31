const express = require("express");
const { default: mongoose } = require("mongoose");
const app = express();

const bookRoutes = require("./routes/bookRoutes");

require("dotenv").config();

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

app.use("/book", bookRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Hi Express" });
});

mongoose
  .connect(process.env.DB_CONNECT)
  .then(() => {
    console.log("Connect success!");
    app.listen(process.env.PORT);
  })
  .catch((err) => {
    console.error(err);
  });
