const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.headers["authorization"] || "";
  const bearerToken = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
  const cookieHeader = req.headers.cookie || "";
  const cookieToken = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("token="))
    ?.split("=")[1];

  const token = bearerToken || cookieToken;

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const verified = jwt.verify(token, "secret123");
    req.user = verified;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
