require("dotenv").config();

const express = require("express");
const { default: mongoose } = require("mongoose");

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const app = express();

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/user", userRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Hi Express" });
});

mongoose
  .connect(process.env.DB_CONNECT)
  .then(() => {
    app.listen(process.env.PORT);
    console.log("Connect success!");
  })
  .catch((err) => {
    console.error(err);
  });
