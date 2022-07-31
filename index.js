require("dotenv").config();

const express = require("express");
const { default: mongoose } = require("mongoose");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bookRoutes = require("./routes/bookRoutes");
const app = express();

const User = require("./models/User");

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

app.use("/book", bookRoutes);

app.get("/user/:id", checkToken, async (req, res) => {
  const id = req.params.id;

  const user = await User.findById(id, "-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json(user);
});

function checkToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied" });
  }

  try {
    const secret = process.env.SECRET_KEY;

    jwt.verify(token, secret);

    next();
  } catch (error) {
    res.status(400).json({ message: "Ivalid token" });
  }
}

app.get("/", (req, res) => {
  res.json({ message: "Hi Express" });
});

//create user route
app.post("/auth/register", async (req, res) => {
  const { userName, email, password, confirmPassword } = req.body;

  if (!userName) {
    return res.status(422).json({ message: "User name is required" });
  }

  const userExistis = await User.findOne({
    email: email,
  });

  if (userExistis) {
    return res.status(422).json({ message: "Email is used" });
  }

  //create password

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  //create user
  const user = new User({
    userName,
    email,
    password: passwordHash,
  });

  try {
    await user.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json(error);
  }
});

//login user
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  //validar aqui

  const user = await User.findOne({
    email: email,
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const checkPassword = await bcrypt.compare(password, user.password);

  if (!checkPassword) {
    return res.status(422).json({ message: "Invalid password" });
  }

  try {
    const secret = process.env.SECRET_KEY;

    const token = jwt.sign(
      {
        id: user._id,
      },
      secret
    );

    res
      .status(200)
      .json({ message: "Authentication created successfully", token });
  } catch (error) {
    res.status(500).json(error);
  }
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
