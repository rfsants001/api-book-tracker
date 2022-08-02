const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(422).json({ message: "Field is required" });
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
    name,
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

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({ message: "Field is required" });
  }

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
      .json({ message: "Authentication created successfully", token, user });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
