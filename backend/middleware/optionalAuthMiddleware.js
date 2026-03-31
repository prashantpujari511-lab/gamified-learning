const jwt = require("jsonwebtoken");

/**
 * Optional Auth Middleware
 * Attempts to authenticate but doesn't fail if no token is provided
 * Useful for guest players
 */
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
    // No token provided, but that's okay - guest mode
    req.user = null;
    return next();
  }

  try {
    const verified = jwt.verify(token, "secret123");
    req.user = verified;
  } catch (err) {
    // Invalid token, treat as guest
    req.user = null;
  }

  next();
};
