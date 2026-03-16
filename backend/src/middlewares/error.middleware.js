const errorHandler = (err, req, res, next) => {
  try {
    console.log(err.stack);

    return res.status(500).json({ message: "Internal Server Error" });
  } catch (error) {
    next(error);
  }
};

module.exports = errorHandler;