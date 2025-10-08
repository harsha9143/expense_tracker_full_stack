const jwt = require("jsonwebtoken");

exports.authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // Debug logging to trace missing tokens
  if (!token) {
    console.log(
      `authenticate: no token for ${req.method} ${req.originalUrl} - Authorization header:`,
      authHeader
    );
    return res.status(401).json({ message: "Access denied" });
  }

  jwt.verify(token, "secretKey", (err, result) => {
    if (err) {
      console.log(
        `authenticate: token invalid for ${req.method} ${req.originalUrl}:`,
        err.message
      );
      return res.status(403).json({ message: "Invalid Token" });
    }

    req.user = result;
    next();
  });
};
