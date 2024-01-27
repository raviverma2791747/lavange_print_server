const errorHandler = (err, req, res, next) => {
  const errStatus = err.statusCode || 500;
  const errMsg = err.message || "Something went wrong";
  console.log("Error:", errMsg);
  res.status(errStatus).json({
    status: errStatus,
    error: "Server Error",
    messages: [errMsg],
  });
};

module.exports = errorHandler;
