const jwt = require("jsonwebtoken");

const preAuthHandler = (req, res, next) => {
  try {
    let token = req.header("x-session-token") || req.header("x-reset-token");
    
    if (!token && req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      const err = new Error("Unauthorized: missing session token");
      err.statusCode = 401;
      throw err;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.email = decoded.email;

    next();
  } catch (error) {
    error.statusCode = 401;
    next(error);
  }
};

module.exports = preAuthHandler;