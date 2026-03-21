const jwt = require("jsonwebtoken");

exports.generateToken = (id) => {
  try {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: "15d",
    });
  } catch (error) {
    console.log(error);
  }
};

exports.generateSessionToken = (email) => {
  try {
    return jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });
  } catch (error) {
    console.log(error);
  }
};
