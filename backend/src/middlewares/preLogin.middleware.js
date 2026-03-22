const jwt = require("jsonwebtoken");

const preAuthHandler = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next();
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.email = decoded.email;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = preAuthHandler;