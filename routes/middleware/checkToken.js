const jwt = require("jsonwebtoken");

module.exports = function checkToken(req, res, next) {
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
    res.status(400).json({ message: "Invalid token" });
  }
};
